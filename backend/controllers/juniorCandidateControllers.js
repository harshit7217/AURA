import bcrypt from "bcryptjs";
import juniorCandidateModel from "../models/juniorCandidateModel.js";

export const registerJuniorCandidate = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: "Name, email and password are required"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const existingCandidate = await juniorCandidateModel.findOne({email: email.toLowerCase(),})

        if(existingCandidate) {
            return res.status(409).json({message: "Email is already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const candidate = await juniorCandidateModel.create({name, email, password: hashedPassword});

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