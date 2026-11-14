import jwt from "jsonwebtoken";
import juniorCandidateModel from "../models/juniorCandidateModel.js";

export const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if(!header || !header.startsWith("Bearer")) {
            return res.status(401).json({message: "Not authorized, token missing"});
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const candidate = await juniorCandidateModel.findById(decoded.id);
        if(!candidate) {
            return res.status(401).json({message: "User no longer exists"});
        }

        req.candidate = candidate;
        next();
    }catch(err) {
        res.status(401).json({message: "Not authorized, token invalid or expired"});
    }
}