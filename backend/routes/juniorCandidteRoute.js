import { Router } from "express";
import {
    loginJuniorCandidateController,
    registerJuniorCandidate,
    getMe,
    getJuniorAssessment,
    getAssessmentResults,
    submitAssessmentResult,
} from "../controllers/juniorCandidateControllers.js";
import { protect } from "../middleware/juniorCandidateMiddleware.js"

const router = Router();

router.post("/register", registerJuniorCandidate);
router.post("/login", loginJuniorCandidateController);
router.get("/me", protect, getMe);
router.get("/assessment", protect, getJuniorAssessment);
router.get("/assessment-results", protect, getAssessmentResults);
router.post("/assessment-results", protect, submitAssessmentResult);

export default router;