import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const assessmentDirectory = fileURLToPath(
    new URL("../data/junior-assessment/", import.meta.url)
);
const assessmentIdPattern = /^[a-zA-Z0-9_-]+$/;

const readAssessmentFile = async (assessmentId) => {
    if (!assessmentIdPattern.test(assessmentId)) {
        return null;
    }

    try {
        const content = await readFile(
            path.join(assessmentDirectory, `${assessmentId}.json`),
            "utf8"
        );
        return JSON.parse(content);
    } catch (error) {
        if (error.code === "ENOENT") {
            return null;
        }
        throw error;
    }
};

const getQuestions = (assessment) =>
    assessment.sections.flatMap((section) =>
        section.questions.map((question) => ({
            ...question,
            section: section.section_name,
        }))
    );

const getAssessmentSummary = (assessmentId, assessment) => ({
    assessmentId,
    assessmentTitle: assessment.assessment_title,
    totalQuestions: getQuestions(assessment).length,
    totalMarks: assessment.total_marks,
    durationMinutes: assessment.duration_minutes,
    instructions: assessment.instructions,
});

export const getAssessments = async (req, res) => {
    try {
        const files = (await readdir(assessmentDirectory))
            .filter((file) => file.endsWith(".json"))
            .sort((left, right) => left.localeCompare(right));
        const assessments = await Promise.all(files.map(async (file) => {
            const assessmentId = path.basename(file, ".json");
            const assessment = await readAssessmentFile(assessmentId);
            return getAssessmentSummary(assessmentId, assessment);
        }));

        return res.json({ assessments });
    } catch (error) {
        console.error("Unable to list assessments", error);
        return res.status(500).json({ message: "Unable to load assessments" });
    }
};

export const getAssessment = async (req, res) => {
    try {
        const assessment = await readAssessmentFile(req.params.assessmentId);
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        const questions = getQuestions(assessment).map(
            ({ answer, ...question }) => question
        );
        return res.json({
            assessment: {
                ...getAssessmentSummary(req.params.assessmentId, assessment),
                questions,
            },
        });
    } catch (error) {
        console.error("Unable to load assessment", error);
        return res.status(500).json({ message: "Unable to load assessment" });
    }
};

export const submitAssessment = async (req, res) => {
    try {
        const assessment = await readAssessmentFile(req.params.assessmentId);
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        const answers = req.body?.answers;
        if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
            return res.status(400).json({ message: "Answers must be an object" });
        }

        const questions = getQuestions(assessment);
        const questionsById = new Map(questions.map((question) => [
            String(question.id),
            question,
        ]));
        const submittedAnswers = Object.entries(answers);
        const invalidAnswer = submittedAnswers.some(([questionId, answer]) => {
            const question = questionsById.get(questionId);
            return !question || !question.options.includes(answer);
        });
        if (invalidAnswer) {
            return res.status(400).json({ message: "One or more answers are invalid" });
        }

        const score = submittedAnswers.reduce((total, [questionId, answer]) => {
            const question = questionsById.get(questionId);
            return total + (answer === question.answer ? question.marks : 0);
        }, 0);
        const result = {
            assessmentId: req.params.assessmentId,
            assessmentTitle: assessment.assessment_title,
            score,
            totalMarks: assessment.total_marks,
            attempted: submittedAnswers.length,
            questionCount: questions.length,
            completedAt: new Date(),
        };

        req.candidate.assessmentResults.push(result);
        await req.candidate.save();

        return res.status(201).json({ result });
    } catch (error) {
        console.error("Unable to submit assessment", error);
        return res.status(500).json({ message: "Unable to save assessment result" });
    }
};

export const getAssessmentResults = (req, res) => {
    const results = [...(req.candidate.assessmentResults || [])]
        .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
    return res.json({ results });
};
