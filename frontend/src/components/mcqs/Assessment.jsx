import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api.js";

const formatTime = (secs) => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
};

const Assessment = () => {
    const { assessmentId } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [started, setStarted] = useState(false);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const autoSubmitAttempted = useRef(false);

    useEffect(() => {
        let isActive = true;

        const loadAssessment = async () => {
            try {
                const data = await apiRequest(
                    `/api/junior-candidates/assessments/${encodeURIComponent(assessmentId)}`
                );
                if (isActive) {
                    setAssessment(data.assessment);
                    setTimeLeft(data.assessment.durationMinutes * 60);
                }
            } catch (requestError) {
                if (isActive) setLoadError(requestError.message);
            } finally {
                if (isActive) setLoading(false);
            }
        };

        loadAssessment();
        return () => {
            isActive = false;
        };
    }, [assessmentId]);

    const questions = useMemo(() => assessment?.questions || [], [assessment]);

    const submit = useCallback(async () => {
        if (!assessment || submitting || result) return;

        setSubmitting(true);
        setSubmitError("");
        try {
            const data = await apiRequest(
                `/api/junior-candidates/assessments/${encodeURIComponent(assessmentId)}/submit`,
                {
                    method: "POST",
                    body: JSON.stringify({ answers }),
                }
            );
            setResult(data.result);
        } catch (requestError) {
            setSubmitError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    }, [answers, assessment, assessmentId, result, submitting]);

    useEffect(() => {
        if (!assessment || !started || result || submitting) return undefined;
        if (timeLeft <= 0) {
            if (!autoSubmitAttempted.current) {
                autoSubmitAttempted.current = true;
                submit();
            }
            return undefined;
        }

        const timer = setTimeout(() => setTimeLeft((remaining) => remaining - 1), 1000);
        return () => clearTimeout(timer);
    }, [assessment, result, started, submitting, submit, timeLeft]);

    const handleSubmitClick = () => {
        const unanswered = questions.length - Object.keys(answers).length;
        const message = unanswered
            ? `You have ${unanswered} unanswered question(s). Submit anyway?`
            : "Submit your assessment?";
        if (window.confirm(message)) submit();
    };

    const wrapper = "flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8";
    const card = "w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8";

    if (loading) {
        return <main className={wrapper}>Loading assessment...</main>;
    }

    if (loadError || !assessment) {
        return (
            <main className={wrapper}>
                <section className={card}>
                    <p role="alert" className="text-red-700">{loadError || "Assessment not found."}</p>
                    <Link to="/assessments" className="mt-5 inline-block font-semibold text-indigo-600 hover:text-indigo-800">
                        Back to assessments
                    </Link>
                </section>
            </main>
        );
    }

    if (!started) {
        return (
            <main className={wrapper}>
                <section className={card}>
                    <Link to="/assessments" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                        ← All assessments
                    </Link>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">{assessment.assessmentTitle}</h1>
                    <p className="mt-2 text-sm text-slate-600">{assessment.instructions}</p>
                    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                        {[
                            ["Questions", assessment.totalQuestions],
                            ["Marks", assessment.totalMarks],
                            ["Minutes", assessment.durationMinutes],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-lg bg-indigo-50 p-3">
                                <p className="text-xl font-bold text-indigo-600">{value}</p>
                                <p className="text-xs text-slate-500">{label}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setStarted(true)}
                        className="mt-8 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Start test
                    </button>
                </section>
            </main>
        );
    }

    if (result) {
        const percent = result.totalMarks
            ? Math.round((result.score / result.totalMarks) * 100)
            : 0;
        return (
            <main className={wrapper}>
                <section className={`${card} text-center`}>
                    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Assessment complete</p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900">{assessment.assessmentTitle}</h1>
                    <p className="mt-6 text-5xl font-bold text-indigo-600">
                        {result.score}
                        <span className="text-2xl text-slate-400"> / {result.totalMarks}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        {percent}% · {result.attempted} of {result.questionCount} attempted
                    </p>
                    <Link
                        to="/dashboard"
                        className="mt-8 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        View dashboard
                    </Link>
                </section>
            </main>
        );
    }

    const question = questions[current];
    if (!question) {
        return (
            <main className={wrapper}>
                <section className={card}>
                    <p role="alert" className="text-red-700">This assessment has no questions.</p>
                    <Link to="/dashboard" className="mt-5 inline-block font-semibold text-indigo-600">
                        Back to dashboard
                    </Link>
                </section>
            </main>
        );
    }

    const optionClass = (option) =>
        `w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
            answers[question.id] === option
                ? "border-indigo-500 bg-indigo-50 font-medium text-indigo-700"
                : "border-slate-300 text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
        }`;

    const questionNavClass = (index) => {
        const base = "h-8 w-8 rounded text-xs font-medium transition";
        if (index === current) return `${base} bg-indigo-600 text-white`;
        if (answers[questions[index].id] !== undefined) return `${base} bg-green-100 text-green-700`;
        return `${base} bg-slate-100 text-slate-500 hover:bg-slate-200`;
    };

    return (
        <main className={wrapper}>
            <section className={card}>
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                            {question.section}
                        </p>
                        <p className="text-sm text-slate-500">
                            Question {current + 1} of {questions.length}
                        </p>
                    </div>
                    <div className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        timeLeft <= 60 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-700"
                    }`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <h2 className="mb-4 text-lg font-semibold text-slate-900">{question.question}</h2>
                <div className="space-y-3">
                    {question.options.map((option) => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => setAnswers((previous) => ({
                                ...previous,
                                [question.id]: option,
                            }))}
                            className={optionClass(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {submitError && (
                    <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                    </p>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => setCurrent((index) => index - 1)}
                        disabled={current === 0 || submitting}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>
                    {current === questions.length - 1 ? (
                        <button
                            type="button"
                            onClick={submitError ? submit : handleSubmitClick}
                            disabled={submitting}
                            className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : submitError ? "Retry submission" : "Submit"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setCurrent((index) => index + 1)}
                            disabled={submitting}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            Next
                        </button>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4" aria-label="Question navigation">
                    {questions.map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            aria-label={`Go to question ${index + 1}`}
                            aria-current={index === current ? "step" : undefined}
                            onClick={() => setCurrent(index)}
                            className={questionNavClass(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Assessment;
