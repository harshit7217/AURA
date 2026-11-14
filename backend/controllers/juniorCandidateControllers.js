import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import juniorCandidateModel from "../models/juniorCandidateModel.js";

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const candidate = await juniorCandidateModel.create({name, email, password: hashedPassword});
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