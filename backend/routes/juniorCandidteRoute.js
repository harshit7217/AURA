import { Router } from "express";
import { loginJuniorCandidateController, registerJuniorCandidate, getMe } from "../controllers/juniorCandidateControllers.js";
import { protect } from "../middleware/juniorCandidateMiddleware.js"

const router = Router();

router.post("/register", registerJuniorCandidate);
router.post("/login", loginJuniorCandidateController);
router.get("/me", protect, getMe);

export default router;