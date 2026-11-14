import { Router } from "express";
import { registerJuniorCandidate } from "../controllers/juniorCandidateControllers.js";

const router = Router();

router.post("/register", registerJuniorCandidate);

export default router;