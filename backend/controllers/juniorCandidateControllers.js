import jwt from "jsonwebtoken";
import juniorCandidateModel from "../models/juniorCandidateModel.js";

const signToken = (candidateId) => {
    return jwt.sign({id: candidateId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })
}

export const registerJuniorCandidate = async (req, res) => {
    try {
        const {name, email, password} = req.body || {};

        if (typeof name !== "string" || !name.trim()
            || typeof email !== "string" || !email.trim()
            || typeof password !== "string") {
            return res.status(400).json({message: "Name, email and password are required"});
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({message: "Enter a valid email address"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const existingCandidate = await juniorCandidateModel.findOne({ email: normalizedEmail });
        const previousApprovalStatus = existingCandidate?.approvalStatus;
        if (previousApprovalStatus === "approved") {
            return res.status(409).json({message: "Email is already registered"});
        }

        const approvalToken = createApprovalToken();
        const candidate = existingCandidate || new juniorCandidateModel({
            name: name.trim(),
            email: normalizedEmail,
            password,
            approvalStatus: "pending",
        });

        if (previousApprovalStatus === "rejected") {
            candidate.name = name.trim();
            candidate.password = password;
            candidate.approvalStatus = "pending";
        }
        candidate.approvalTokenHash = approvalToken.hash;
        candidate.approvalTokenExpiresAt = approvalToken.expiresAt;
        await candidate.save();

        try {
            await sendApprovalEmail(candidate, approvalToken.token);
        } catch (error) {
            console.error("Candidate approval email error", error.message);
            return res.status(503).json({
                message: "Your request was saved, but the approval email could not be sent. Please submit again shortly.",
            });
        }

        const message = previousApprovalStatus === "pending"
            ? "Your request is already pending. A new approval email has been sent."
            : "Your registration request has been sent for approval. You can log in after it is approved.";
        return res.status(previousApprovalStatus === "pending" ? 200 : 201).json({ message });
    }catch(error) {
        console.error("Register error", error);
        if (error.code === 11000) {
            return res.status(409).json({message: "Email is already registered"});
        }
        return res.status(500).json({message: "Server error"});
    }
}

export const loginJuniorCandidateController = async (req, res) => {
    try {
        const {email, password} = req.body || {};

        if(typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }

        const candidate = await juniorCandidateModel.findOne({email: email.trim().toLowerCase()}).select("+password");

        if(!candidate || !(await candidate.comparePassword(password))) {
            return res.status(401).json({message: "Invalid email or password"});
        }

        if (candidate.approvalStatus === "pending") {
            return res.status(403).json({message: "Your registration request is awaiting approval."});
        }
        if (candidate.approvalStatus === "rejected") {
            return res.status(403).json({message: "Your registration request was rejected. Please submit a new request to try again."});
        }

        const token = signToken(candidate._id);

        res.json({message: "Login successful", token, candidate: {
            id: candidate._id, name: candidate.name, email: candidate.email
        }})
    }catch(err) {
        console.error(err)
        res.status(500).json({ message: "Server error", error: err.message});
    }
}

export const reviewRegistrationRequest = async (req, res) => {
    const { token, decision } = req.body || {};
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)
        || !["approve", "reject"].includes(decision)) {
        return res.status(400).json({ message: "A valid review token and decision are required" });
    }

    const approvalStatus = decision === "approve" ? "approved" : "rejected";
    const tokenHash = createHash("sha256").update(token).digest("hex");
    try {
        const candidate = await juniorCandidateModel.findOneAndUpdate(
            {
                approvalStatus: "pending",
                approvalTokenHash: tokenHash,
                approvalTokenExpiresAt: { $gt: new Date() },
            },
            {
                $set: { approvalStatus },
                $unset: { approvalTokenHash: 1, approvalTokenExpiresAt: 1 },
            },
            { new: true, runValidators: true }
        ).select("_id");

        if (!candidate) {
            return res.status(400).json({ message: "This review link is invalid, expired, or has already been used." });
        }

        return res.json({
            message: approvalStatus === "approved"
                ? "Candidate approved. They can now log in."
                : "Request rejected. The candidate can submit a new registration request.",
        });
    } catch (error) {
        console.error("Candidate approval error", error);
        return res.status(500).json({ message: "Unable to update the registration request" });
    }
};

export const getMe = async (req, res) => {
    res.json({user: req.user});
}