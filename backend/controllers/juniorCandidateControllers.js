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
        if (existingCandidate) {
            return res.status(409).json({message: "Email is already registered"});
        }

        const candidate = new juniorCandidateModel({
            name: name.trim(),
            email: normalizedEmail,
            password,
        });
        await candidate.save();

        const token = signToken(candidate._id);
        return res.status(201).json({
            message: "Account created successfully",
            token,
            candidate: { id: candidate._id, name: candidate.name, email: candidate.email },
        });
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

        const token = signToken(candidate._id);

        res.json({message: "Login successful", token, candidate: {
            id: candidate._id, name: candidate.name, email: candidate.email
        }})
    }catch(err) {
        console.error(err)
        res.status(500).json({ message: "Server error", error: err.message});
    }
}

export const getMe = async (req, res) => {
    res.json({
        user: {
            id: req.candidate._id,
            name: req.candidate.name,
            email: req.candidate.email,
        },
    });
}