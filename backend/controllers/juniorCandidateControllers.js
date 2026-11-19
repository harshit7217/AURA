import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import nodemailer from "nodemailer";
import juniorCandidateModel from "../models/juniorCandidateModel.js";

const require = createRequire(import.meta.url);
const assessment = require("../data/juniorAssessment.json");
const approvalTokenLifetimeMs = 48 * 60 * 60 * 1000;

const createApprovalToken = () => {
    const token = randomBytes(32).toString("hex");
    return {
        token,
        hash: createHash("sha256").update(token).digest("hex"),
        expiresAt: new Date(Date.now() + approvalTokenLifetimeMs),
    };
};

const sendApprovalEmail = async (candidate, token) => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPassword) {
        throw new Error("SMTP_USER and SMTP_PASS must be configured to send approval emails");
    }

    const port = Number(process.env.SMTP_PORT || 587);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("SMTP_PORT must be a valid port number");
    }

    const reviewUrl = new URL(
        "/registration-review",
        process.env.FRONTEND_BASE_URL || "http://localhost:5173"
    );
    reviewUrl.hash = new URLSearchParams({ token }).toString();

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp-mail.outlook.com",
        port,
        secure: port === 465,
        requireTLS: port === 587,
        auth: { user: smtpUser, pass: smtpPassword },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || smtpUser,
        to: process.env.ADMIN_APPROVAL_EMAIL || "auraacademy.team@outlook.com",
        subject: "Candidate approval request - AURA Academy",
        text: [
            "A new candidate registration is waiting for review.",
            "",
            `Name: ${candidate.name}`,
            `Email: ${candidate.email}`,
            "",
            "Open the following link to approve or reject this request:",
            reviewUrl.toString(),
            "",
            "This one-time review link expires in 48 hours.",
        ].join("\n"),
    });
};

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

export const getJuniorAssessment = (req, res) => {
    const sections = assessment.sections.map((section) => ({
        section_name: section.section_name,
        questions: section.questions.map(({ id, question, options, marks }) => ({
            id,
            question,
            options,
            marks,
        })),
    }));

    res.json({
        assessment: {
            assessment_id: assessment.assessment_id,
            assessment_title: assessment.assessment_title,
            total_questions: assessment.total_questions,
            total_marks: assessment.total_marks,
            duration_minutes: assessment.duration_minutes,
            instructions: assessment.instructions,
            sections,
        },
    });
};

export const getAssessmentResults = (req, res) => {
    res.json({
        candidate: {
            name: req.candidate.name,
            email: req.candidate.email,
        },
        attempts: req.candidate.assessmentAttempts,
    });
};

export const submitAssessmentResult = async (req, res) => {
    const answers = req.body?.answers;

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
        return res.status(400).json({ message: "Answers must be an object keyed by question ID" });
    }

    const questions = assessment.sections.flatMap((section) =>
        section.questions.map((question) => ({ ...question, section: section.section_name }))
    );
    const questionsById = new Map(questions.map((question) => [String(question.id), question]));

    for (const [questionId, selectedAnswer] of Object.entries(answers)) {
        const question = questionsById.get(questionId);
        if (!question || typeof selectedAnswer !== "string" || !question.options.includes(selectedAnswer)) {
            return res.status(400).json({ message: "Answers contain an invalid question or option" });
        }
    }

    const questionResults = questions.map((question) => {
        const selectedAnswer = Object.prototype.hasOwnProperty.call(answers, String(question.id))
            ? answers[question.id]
            : null;

        return {
            questionId: question.id,
            section: question.section,
            selectedAnswer,
            marksAwarded: selectedAnswer === question.answer ? question.marks : 0,
            maxMarks: question.marks,
        };
    });
    const score = questionResults.reduce((total, result) => total + result.marksAwarded, 0);
    const totalMarks = questionResults.reduce((total, result) => total + result.maxMarks, 0);

    req.candidate.assessmentAttempts.push({
        assessmentId: assessment.assessment_id,
        assessmentTitle: assessment.assessment_title,
        score,
        totalMarks,
        attempted: Object.keys(answers).length,
        questionResults,
    });
    const attempt = req.candidate.assessmentAttempts[req.candidate.assessmentAttempts.length - 1];

    try {
        await req.candidate.save();
        return res.status(201).json({ attempt });
    } catch (error) {
        console.error("Assessment result save error", error);
        return res.status(500).json({ message: "Unable to save assessment result" });
    }
};