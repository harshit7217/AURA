import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api.js";

const Dashboard = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [resultData, profileData] = await Promise.all([
                    apiRequest("/api/junior-candidates/results"),
                    apiRequest("/api/junior-candidates/me"),
                ]);
                setResults(resultData.results);
                setCandidate(profileData.user);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const chartResults = useMemo(
        () => [...results].reverse(),
        [results]
    );
    const getScorePercent = (result) =>
        result.totalMarks ? (result.score / result.totalMarks) * 100 : 0;
    const averageScore = results.length
        ? Math.round(results.reduce(
            (total, result) => total + getScorePercent(result),
            0
        ) / results.length)
        : 0;
    const completedTests = new Set(results.map((result) => result.assessmentId)).size;

    const signOut = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    if (loading) {
        return <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Loading your dashboard...</main>;
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">AURA Academy</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">
                            Welcome{candidate?.name ? `, ${candidate.name}` : ""}
                        </h1>
                        <p className="mt-1 text-slate-600">Review your progress or browse available assessments.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/assessments")}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Browse assessments
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

                <section aria-label="Assessment summary" className="mb-8 grid gap-4 sm:grid-cols-3">
                    <article className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Average score</p>
                        <p className="mt-2 text-3xl font-bold text-indigo-600">{averageScore}%</p>
                    </article>
                    <article className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Tests completed</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{results.length}</p>
                    </article>
                    <article className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Different tests tried</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{completedTests}</p>
                    </article>
                </section>

                <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Score history</h2>
                        <p className="mt-1 text-sm text-slate-500">Your assessment scores over time.</p>
                    </div>
                    {chartResults.length ? (
                        <div className="overflow-x-auto">
                            <svg
                                viewBox="0 0 640 230"
                                role="img"
                                aria-label="Line chart showing assessment score history"
                                className="h-56 min-w-[560px] w-full"
                            >
                                {[0, 25, 50, 75, 100].map((score) => {
                                    const y = 190 - score * 1.6;
                                    return (
                                        <g key={score}>
                                            <line x1="42" y1={y} x2="620" y2={y} stroke="#e2e8f0" />
                                            <text x="8" y={y + 4} fill="#64748b" fontSize="11">{score}%</text>
                                        </g>
                                    );
                                })}
                                {chartResults.length > 1 && (
                                    <polyline
                                        fill="none"
                                        stroke="#4f46e5"
                                        strokeWidth="3"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        points={chartResults.map((result, index) => {
                                            const x = chartResults.length === 1
                                                ? 42
                                                : 42 + (index / (chartResults.length - 1)) * 578;
                                            const score = getScorePercent(result);
                                            return `${x},${190 - score * 1.6}`;
                                        }).join(" ")}
                                    />
                                )}
                                {chartResults.map((result, index) => {
                                    const x = chartResults.length === 1
                                        ? 42
                                        : 42 + (index / (chartResults.length - 1)) * 578;
                                    const score = getScorePercent(result);
                                    const y = 190 - score * 1.6;
                                    return (
                                        <g key={`${result.assessmentId}-${result.completedAt}-${index}`}>
                                            <title>
                                                {`${result.assessmentTitle}: ${result.score}/${result.totalMarks} (${Math.round(score)}%)`}
                                            </title>
                                            <circle cx={x} cy={y} r="5" fill="#4f46e5" />
                                            <text x={x} y="216" textAnchor="middle" fill="#64748b" fontSize="10">
                                                {new Date(result.completedAt).toLocaleDateString()}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    ) : (
                        <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-600">
                            Complete your first assessment to see your score history here.
                        </p>
                    )}
                </section>

                <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-xl font-bold text-slate-900">All test results</h2>
                    {results.length ? (
                        <ul className="mt-4 divide-y divide-slate-100">
                            {results.map((result, index) => (
                                <li
                                    key={`${result.assessmentId}-${result.completedAt}-${index}`}
                                    className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900">{result.assessmentTitle}</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {new Date(result.completedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-600">
                                            {result.score} / {result.totalMarks} marks
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {Math.round(getScorePercent(result))}%
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-3 text-sm text-slate-600">
                            Your test marks will appear here after you complete an assessment.
                        </p>
                    )}
                </section>

                <section className="rounded-2xl bg-indigo-50 p-6 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Ready for another test?</h2>
                        <p className="mt-1 text-sm text-slate-600">Browse the available assessments on their own page.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/assessments")}
                        className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 sm:mt-0"
                    >
                        View all assessments
                    </button>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
