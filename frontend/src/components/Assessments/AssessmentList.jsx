import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api.js";

const AssessmentList = () => {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isActive = true;

        const loadAssessments = async () => {
            try {
                const [assessmentData, resultData] = await Promise.all([
                    apiRequest("/api/junior-candidates/assessments"),
                    apiRequest("/api/junior-candidates/results"),
                ]);
                if (isActive) {
                    setAssessments(assessmentData.assessments);
                    setResults(resultData.results);
                }
            } catch (requestError) {
                if (isActive) setError(requestError.message);
            } finally {
                if (isActive) setLoading(false);
            }
        };

        loadAssessments();
        return () => {
            isActive = false;
        };
    }, []);

    const signOut = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">AURA Academy</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">Available assessments</h1>
                        <p className="mt-1 text-slate-600">Choose a test to view its instructions and begin.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            onClick={signOut}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                        >
                            Sign out
                        </button>
                    </div>
                </header>

                {error && (
                    <p role="alert" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-slate-600">Loading assessments...</p>
                ) : assessments.length ? (
                    <section aria-label="All available assessments" className="grid gap-4 md:grid-cols-2">
                        {assessments.map((assessment) => {
                            const latestResult = results.find(
                                (result) => result.assessmentId === assessment.assessmentId
                            );
                            return (
                                <article
                                    key={assessment.assessmentId}
                                    className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                        Assessment
                                    </p>
                                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                                        {assessment.assessmentTitle}
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-600">
                                        {assessment.totalQuestions} questions · {assessment.totalMarks} marks · {assessment.durationMinutes} minutes
                                    </p>
                                    {latestResult && (
                                        <p className="mt-3 text-sm font-medium text-indigo-700">
                                            Latest score: {latestResult.score}/{latestResult.totalMarks}
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/junior-assessment/${encodeURIComponent(assessment.assessmentId)}`)}
                                        className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                        {latestResult ? "Take again" : "Open assessment"}
                                    </button>
                                </article>
                            );
                        })}
                    </section>
                ) : (
                    <p className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">
                        No assessments are available right now.
                    </p>
                )}
            </div>
        </main>
    );
};

export default AssessmentList;
