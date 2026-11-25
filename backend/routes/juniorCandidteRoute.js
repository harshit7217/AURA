import { Router } from "express";
import { loginJuniorCandidateController, registerJuniorCandidate, getMe } from "../controllers/juniorCandidateControllers.js";
import {
    getAssessment,
    getAssessments,
    getAssessmentResults,
    submitAssessment,
} from "../controllers/juniorAssessmentControllers.js";
import { protect } from "../middleware/juniorCandidateMiddleware.js"

const router = Router();

router.post("/register", registerJuniorCandidate);
router.post("/login", loginJuniorCandidateController);
router.get("/me", protect, getMe);
router.get("/assessments", protect, getAssessments);
router.get("/assessments/:assessmentId", protect, getAssessment);
router.post("/assessments/:assessmentId/submit", protect, submitAssessment);
router.get("/results", protect, getAssessmentResults);

export default router;