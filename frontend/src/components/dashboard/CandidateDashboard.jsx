import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api.js";

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        apiRequest("/api/junior-candidates/assessment-results")
            .then((results) => {
                if (active) setData(results);
            })
            .catch((requestError) => {
                if (active) setError(requestError.message);
            });
        return () => {
            active = false;
        };
    }, []);

    const attempts = useMemo(
        () => [...(data?.attempts || [])].sort(
            (first, second) => new Date(first.submittedAt) - new Date(second.submittedAt)
        ),
        [data]
    );
    const latestAttempt = attempts.at(-1);
    const highestScore = attempts.reduce((highest, attempt) => Math.max(highest, attempt.score), 0);
    const chartMax = Math.max(latestAttempt?.totalMarks || 0, 1);
    const chartWidth = 640;
    const chartHeight = 220;
    const chartPadding = 28;
    const points = attempts.map((attempt, index) => {
        const x = attempts.length === 1
            ? chartWidth / 2
            : chartPadding + (index / (attempts.length - 1)) * (chartWidth - chartPadding * 2);
        const y = chartHeight - chartPadding - (attempt.score / chartMax) * (chartHeight - chartPadding * 2);
        return { x, y, attempt, index };
    });
    const sectionScores = latestAttempt
        ? Object.values(latestAttempt.questionResults.reduce((sections, result) => {
            const section = sections[result.section] || { name: result.section, score: 0, total: 0 };
            section.score += result.marksAwarded;
            section.total += result.maxMarks;
            sections[result.section] = section;
            return sections;
        }, {}))
        : [];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-900">Unable to load dashboard</h1>
                    <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>
                    <button onClick={handleLogout} className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                        Sign in again
                    </button>
                </div>
            </main>
        );
    }

    if (!data) {
        return <main className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">Loading your dashboard...</main>;
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600">AURA Academy</p>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Candidate dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Welcome, {data.candidate.name}</p>
                    </div>
                    <button onClick={handleLogout} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                        Sign out
                    </button>
                </header>

                <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Assessment summary">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Assessments completed</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{attempts.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Highest score</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {attempts.length ? `${highestScore} / ${latestAttempt.totalMarks}` : "—"}
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-indigo-600 p-5 text-white shadow-sm">
                        <div>
                            <p className="text-sm text-indigo-100">Ready to practice?</p>
                            <p className="mt-1 font-semibold">Take the junior assessment</p>
                        </div>
                        <button onClick={() => navigate("/junior-assessment")} className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
                            Start
                        </button>
                    </div>
                </section>

                {attempts.length === 0 ? (
                    <section className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                        <h2 className="text-lg font-semibold text-gray-900">Your scores will appear here</h2>
                        <p className="mt-2 text-sm text-gray-500">Complete an MCQ assessment to see your score charts and section breakdown.</p>
                    </section>
                ) : (
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold text-gray-900">Score history</h2>
                                    <p className="mt-1 text-sm text-gray-500">Marks earned in each assessment</p>
                                </div>
                                <p className="text-sm font-semibold text-indigo-700">{latestAttempt.score} / {latestAttempt.totalMarks}</p>
                            </div>
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Assessment score history" className="mt-5 w-full overflow-visible">
                                {[0, 0.5, 1].map((fraction) => {
                                    const y = chartHeight - chartPadding - fraction * (chartHeight - chartPadding * 2);
                                    return <line key={fraction} x1={chartPadding} x2={chartWidth - chartPadding} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 5" />;
                                })}
                                {points.length > 1 && (
                                    <polyline
                                        points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
                                        fill="none"
                                        stroke="#4f46e5"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}
                                {points.map(({ x, y, attempt, index }) => (
                                    <circle key={attempt._id || index} cx={x} cy={y} r="5" fill="#4f46e5">
                                        <title>Attempt {index + 1}: {attempt.score} of {attempt.totalMarks}</title>
                                    </circle>
                                ))}
                            </svg>
                            <div className="mt-2 flex justify-between text-xs text-gray-400">
                                <span>First attempt</span><span>{attempts.length} {attempts.length === 1 ? "attempt" : "attempts"}</span>
                            </div>
                        </section>

                        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="font-semibold text-gray-900">Latest section scores</h2>
                            <p className="mt-1 text-sm text-gray-500">Marks earned by MCQ section</p>
                            <div className="mt-6 space-y-5">
                                {sectionScores.map((section) => (
                                    <div key={section.name}>
                                        <div className="mb-2 flex justify-between gap-3 text-sm">
                                            <span className="font-medium text-gray-700">{section.name}</span>
                                            <span className="shrink-0 text-gray-500">{section.score} / {section.total}</span>
                                        </div>
                                        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="h-full rounded-full bg-indigo-500"
                                                style={{ width: `${section.total ? (section.score / section.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl bg-white p-5 shadow-sm sm:col-span-2 sm:p-6">
                            <h2 className="font-semibold text-gray-900">Recent attempts</h2>
                            <div className="mt-4 divide-y divide-gray-100">
                                {[...attempts].reverse().slice(0, 5).map((attempt) => (
                                    <div key={attempt._id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                                        <div>
                                            <p className="font-medium text-gray-800">{attempt.assessmentTitle}</p>
                                            <p className="mt-1 text-xs text-gray-500">{new Date(attempt.submittedAt).toLocaleString()}</p>
                                        </div>
                                        <p className="font-semibold text-indigo-700">{attempt.score} / {attempt.totalMarks}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Dashboard;
