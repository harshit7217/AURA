import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api.js";

const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
};

const Assessment = () => {
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [loadError, setLoadError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const questions = useMemo(
        () => assessment
            ?
            assessment.sections.flatMap((section) =>
                section.questions.map((q) => ({ ...q, section: section.section_name }))
            )
            : [],
        [assessment]
    );

    const [started, setStarted] = useState(false);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({}); // { [questionId]: selectedOption }
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState(null);

    useEffect(() => {
        let active = true;
        apiRequest("/api/junior-candidates/assessment")
            .then((data) => {
                if (!active) return;
                setAssessment(data.assessment);
                setTimeLeft(data.assessment.duration_minutes * 60);
            })
            .catch((error) => {
                if (active) setLoadError(error.message);
            });
        return () => {
            active = false;
        };
    }, []);

    const submit = useCallback(async () => {
        if (submitting) return;
        setSubmitting(true);
        setSubmitError("");
        try {
            const data = await apiRequest("/api/junior-candidates/assessment-results", {
                method: "POST",
                body: JSON.stringify({ answers }),
            });
            setResult(data.attempt);
        } catch (error) {
            setSubmitError(error.message);
        } finally {
            setSubmitting(false);
        }
    }, [answers, submitting]);

    // Countdown timer, auto-submits at zero
    useEffect(() => {
        if (!started || result || submitting || submitError) return;
        const id = setTimeout(() => {
            if (timeLeft <= 1) {
                setTimeLeft(0);
                submit();
            } else {
                setTimeLeft((time) => time - 1);
            }
        }, 1000);
        return () => clearTimeout(id);
    }, [started, result, timeLeft, submit, submitting, submitError]);

    const handleSubmitClick = () => {
        const unanswered = questions.length - Object.keys(answers).length;
        const msg = unanswered
            ? `You have ${unanswered} unanswered question(s). Submit anyway?`
            : "Submit your assessment?";
        if (window.confirm(msg)) submit();
    };

    const card = "w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg";
    const wrapper = "flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8";

    if (loadError) {
        return (
            <div className={wrapper}>
                <div className={card}>
                    <p role="alert" className="text-sm text-red-600">{loadError}</p>
                    <button onClick={() => navigate("/junior-dashboard")} className="mt-5 text-sm font-semibold text-indigo-600">
                        Return to dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!assessment) {
        return <div className={wrapper}><p className="text-sm text-gray-500">Loading assessment...</p></div>;
    }

    // ---------- Start screen ----------
    if (!started) {
        return (
            <div className={wrapper}>
                <div className={card}>
                    <h1 className="text-2xl font-bold text-gray-800">{assessment.assessment_title}</h1>
                    <p className="mt-2 text-sm text-gray-500">{assessment.instructions}</p>
                    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-lg bg-indigo-50 p-3">
                            <p className="text-xl font-bold text-indigo-600">{assessment.total_questions}</p>
                            <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div className="rounded-lg bg-indigo-50 p-3">
                            <p className="text-xl font-bold text-indigo-600">{assessment.total_marks}</p>
                            <p className="text-xs text-gray-500">Marks</p>
                        </div>
                        <div className="rounded-lg bg-indigo-50 p-3">
                            <p className="text-xl font-bold text-indigo-600">{assessment.duration_minutes} min</p>
                            <p className="text-xs text-gray-500">Duration</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setStarted(true)}
                        className="mt-8 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Start Test
                    </button>
                </div>
            </div>
        );
    }

    // ---------- Result screen ----------
    if (result) {
        const percent = Math.round((result.score / result.totalMarks) * 100);
        return (
            <div className={wrapper}>
                <div className={`${card} text-center`}>
                    <h1 className="text-2xl font-bold text-gray-800">Test Submitted</h1>
                    <p className="mt-6 text-5xl font-bold text-indigo-600">
                        {result.score}
                        <span className="text-2xl text-gray-400"> / {result.totalMarks}</span>
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        {percent}% &middot; {result.attempted} of {questions.length} attempted
                    </p>
                    <button
                        onClick={() => navigate("/junior-dashboard")}
                        className="mt-8 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        View dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ---------- Question screen ----------
    const q = questions[current];
    const lowTime = timeLeft <= 60;

    const optionClass = (opt) =>
        `w-full rounded-lg border px-4 py-3 text-left text-sm transition ${answers[q.id] === opt
            ? "border-indigo-500 bg-indigo-50 font-medium text-indigo-700"
            : "border-gray-300 text-gray-700 hover:border-indigo-300 hover:bg-gray-50"
        }`;

    const navClass = (i) => {
        const base = "h-8 w-8 rounded text-xs font-medium transition";
        if (i === current) return `${base} bg-indigo-600 text-white`;
        if (answers[questions[i].id]) return `${base} bg-green-100 text-green-700`;
        return `${base} bg-gray-100 text-gray-500 hover:bg-gray-200`;
    };

    return (
        <div className={wrapper}>
            <div className={card}>
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                            {q.section}
                        </p>
                        <p className="text-sm text-gray-500">
                            Question {current + 1} of {questions.length}
                        </p>
                    </div>
                    <div
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${lowTime ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question */}
                <h2 className="mb-4 text-lg font-semibold text-gray-800">{q.question}</h2>
                <div className="space-y-3">
                    {q.options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                            className={optionClass(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {/* Navigation */}
                {submitError && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <p role="alert" className="text-sm text-red-600">{submitError}</p>
                        <button
                            onClick={submit}
                            disabled={submitting}
                            className="text-sm font-semibold text-indigo-600 disabled:opacity-60"
                        >
                            Retry saving
                        </button>
                    </div>
                )}
                <div className="mt-6 flex items-center justify-between">
                    <button
                        onClick={() => setCurrent((c) => c - 1)}
                        disabled={current === 0}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>
                    {current === questions.length - 1 ? (
                        <button
                            onClick={handleSubmitClick}
                            disabled={submitting}
                            className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : "Submit"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrent((c) => c + 1)}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Next
                        </button>
                    )}
                </div>

                {/* Question navigator */}
                <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {questions.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} className={navClass(i)}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Assessment;