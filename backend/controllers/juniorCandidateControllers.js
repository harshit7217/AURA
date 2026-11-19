import jwt from "jsonwebtoken";
import { createRequire } from "node:module";
import juniorCandidateModel from "../models/juniorCandidateModel.js";

const require = createRequire(import.meta.url);
const assessment = require("../data/juniorAssessment.json");

const signToken = (candidateId) => {
    return jwt.sign({id: candidateId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })
}

export const registerJuniorCandidate = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: "Name, email and password are required"});
        }

        const existingCandidate = await juniorCandidateModel.findOne({email: email.toLowerCase(),})

        if(existingCandidate) {
            return res.status(409).json({message: "Email is already registered"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const candidate = await juniorCandidateModel.create({name, email, password});
        const token = signToken(candidate._id);

        return res.status(201).json({message: "Registered successfully", candidate: {
            id: candidate._id,
            name: candidate.name,
            email: candidate.email,
        },});
    }catch(error) {
        console.error("Register error", error);
        return res.status(500).json({message: "Server error"});
    }

}

export const loginJuniorCandidateController = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }

        const candidate = await juniorCandidateModel.findOne({email: email.toLowerCase()}).select("+password");

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