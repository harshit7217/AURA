import { useState } from "react";
import { Link } from "react-router-dom";

const QUESTIONS = [
    {
        id: 1,
        text: "Meera noticed that her classmate had forgotten his lunch. She shared half of her lunch with him. What trait does Meera show?",
        options: [
            { key: "A", text: "Selfish" },
            { key: "B", text: "Generous" },
            { key: "C", text: "Careless" },
            { key: "D", text: "Impatient" },
        ],
        answer: "B",
    },
    {
        id: 2,
        text: "Arjun waited quietly for his turn while everyone else was getting their certificates. Which trait does Arjun show?",
        options: [
            { key: "A", text: "Patient" },
            { key: "B", text: "Rude" },
            { key: "C", text: "Lazy" },
            { key: "D", text: "Selfish" },
        ],
        answer: "A",
    },
    {
        id: 3,
        text: "Sara always completes her homework and submits it on time without being reminded. Sara is ______.",
        options: [
            { key: "A", text: "Careless" },
            { key: "B", text: "Responsible" },
            { key: "C", text: "Shy" },
            { key: "D", text: "Rude" },
        ],
        answer: "B",
    },
    {
        id: 4,
        text: "When the teacher asked a question, Riya raised her hand and answered clearly even though she was nervous. Which trait does she show?",
        options: [
            { key: "A", text: "Confident" },
            { key: "B", text: "Lazy" },
            { key: "C", text: "Selfish" },
            { key: "D", text: "Careless" },
        ],
        answer: "A",
    },
    {
        id: 5,
        text: "Dev saw a new student sitting alone during break. He introduced himself and invited the student to play. Dev is ______.",
        options: [
            { key: "A", text: "Friendly" },
            { key: "B", text: "Impatient" },
            { key: "C", text: "Rude" },
            { key: "D", text: "Careless" },
        ],
        answer: "A",
    },
    {
        id: 6,
        text: "Tina accidentally broke her brother's toy. She told him the truth instead of blaming someone else. Which character trait does Tina show?",
        options: [
            { key: "A", text: "Honest" },
            { key: "B", text: "Selfish" },
            { key: "C", text: "Lazy" },
            { key: "D", text: "Impatient" },
        ],
        answer: "A",
    },
    {
        id: 7,
        text: "Rahul practises the piano every evening because he wants to improve his skills. Rahul is ______.",
        options: [
            { key: "A", text: "Hardworking" },
            { key: "B", text: "Careless" },
            { key: "C", text: "Rude" },
            { key: "D", text: "Selfish" },
        ],
        answer: "A",
    },
    {
        id: 8,
        text: "A little boy was afraid to enter the dark room, but he took a deep breath and went inside to get his lost bag. What trait does the boy show?",
        options: [
            { key: "A", text: "Lazy" },
            { key: "B", text: "Brave" },
            { key: "C", text: "Selfish" },
            { key: "D", text: "Impatient" },
        ],
        answer: "B",
    },
    {
        id: 9,
        text: "Anaya speaks politely to the school bus driver and always says 'please' and 'thank you.' Which trait does Anaya show?",
        options: [
            { key: "A", text: "Respectful" },
            { key: "B", text: "Careless" },
            { key: "C", text: "Selfish" },
            { key: "D", text: "Lazy" },
        ],
        answer: "A",
    },
    {
        id: 10,
        text: "Kabir noticed that his grandmother was tired, so he brought her a glass of water and helped her sit down. Kabir is ______.",
        options: [
            { key: "A", text: "Caring" },
            { key: "B", text: "Rude" },
            { key: "C", text: "Impatient" },
            { key: "D", text: "Careless" },
        ],
        answer: "A",
    },
    {
        id: 11,
        text: "Naman broke a classroom ruler but left it on the floor without telling anyone. Which trait does this action show?",
        options: [
            { key: "A", text: "Responsible" },
            { key: "B", text: "Careless" },
            { key: "C", text: "Generous" },
            { key: "D", text: "Friendly" },
        ],
        answer: "B",
    },
    {
        id: 12,
        text: "Priya became angry when her friend made a mistake, but instead of shouting, she calmly explained how to correct it. Priya is ______.",
        options: [
            { key: "A", text: "Patient" },
            { key: "B", text: "Selfish" },
            { key: "C", text: "Lazy" },
            { key: "D", text: "Rude" },
        ],
        answer: "A",
    },
    {
        id: 13,
        text: "During an art competition, Ishaan created a completely new design instead of copying someone else's work. Which trait does Ishaan show?",
        options: [
            { key: "A", text: "Creative" },
            { key: "B", text: "Careless" },
            { key: "C", text: "Impatient" },
            { key: "D", text: "Selfish" },
        ],
        answer: "A",
    },
    {
        id: 14,
        text: "Zoya kept asking questions about how plants grow because she wanted to learn more. Zoya is ______.",
        options: [
            { key: "A", text: "Curious" },
            { key: "B", text: "Lazy" },
            { key: "C", text: "Rude" },
            { key: "D", text: "Selfish" },
        ],
        answer: "A",
    },
    {
        id: 15,
        text: "Vihaan saw that his friend was struggling to carry a large box. He offered to carry one side of it. Which trait does Vihaan show?",
        options: [
            { key: "A", text: "Helpful" },
            { key: "B", text: "Careless" },
            { key: "C", text: "Selfish" },
            { key: "D", text: "Impatient" },
        ],
        answer: "A",
    },
    {
        id: 16,
        text: "During a group project, Aditi listened carefully to everyone's ideas and never made fun of anyone's opinion. Aditi is ______.",
        options: [
            { key: "A", text: "Respectful" },
            { key: "B", text: "Rude" },
            { key: "C", text: "Lazy" },
            { key: "D", text: "Selfish" },
        ],
        answer: "A",
    },
    {
        id: 17,
        text: "Mohit refused to lend his coloured pencils to his classmates even though he had many of them. Which trait does Mohit show?",
        options: [
            { key: "A", text: "Generous" },
            { key: "B", text: "Selfish" },
            { key: "C", text: "Caring" },
            { key: "D", text: "Friendly" },
        ],
        answer: "B",
    },
    {
        id: 18,
        text: "Neel often leaves his books at home and forgets important things needed for class. Which trait best describes Neel?",
        options: [
            { key: "A", text: "Honest" },
            { key: "B", text: "Careless" },
            { key: "C", text: "Brave" },
            { key: "D", text: "Generous" },
        ],
        answer: "B",
    },
    {
        id: 19,
        text: "Every morning, Kavya makes her bed, packs her school bag and gets ready without anyone reminding her. Which trait does Kavya show?",
        options: [
            { key: "A", text: "Responsible" },
            { key: "B", text: "Rude" },
            { key: "C", text: "Selfish" },
            { key: "D", text: "Impatient" },
        ],
        answer: "A",
    },
    {
        id: 20,
        text: "During a debate, Aarav listened to the other team carefully and thanked them for sharing their ideas. Which character trait does Aarav show?",
        options: [
            { key: "A", text: "Respectful" },
            { key: "B", text: "Lazy" },
            { key: "C", text: "Careless" },
            { key: "D", text: "Selfish" },
        ],
        answer: "A",
    },
];

function ScoreRing({ correct, total }) {
    const pct = Math.round((correct / total) * 100);
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="#E5E1D8"
                    strokeWidth="9"
                />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="#C6A24D"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="font-[Playfair_Display] text-3xl text-[#0B1739]">
                    {pct}%
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    {correct} / {total}
                </span>
            </div>
        </div>
    );
}

export default function Assessment() {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const total = QUESTIONS.length;
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === total;

    const correctCount = QUESTIONS.reduce(
        (acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc),
        0
    );

    function selectAnswer(questionId, key) {
        if (submitted) return;
        setAnswers((prev) => ({ ...prev, [questionId]: key }));
    }

    function handleSubmit() {
        if (!allAnswered) return;
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleRetake() {
        setAnswers({});
        setSubmitted(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div className="min-h-screen w-full bg-[#F7F5EF] font-[Inter]">
            <header className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
                <span className="font-[Playfair_Display] text-[15px] tracking-[0.15em] text-[#0B1739]">
                    AURA ACADEMY
                </span>
                <Link
                    to="/dashboard"
                    className="text-[13px] font-medium text-slate-500 underline decoration-[#C6A24D] decoration-2 underline-offset-4 hover:text-[#0B1739]"
                >
                    Back to dashboard
                </Link>
            </header>

            <main className="mx-auto max-w-3xl px-8 py-16">
                {/* Result banner */}
                {submitted && (
                    <section className="mb-12 rounded-2xl border border-[#E5E1D8] bg-white p-8 shadow-sm">
                        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                            <ScoreRing correct={correctCount} total={total} />
                            <div className="text-center sm:text-left">
                                <h2 className="font-[Playfair_Display] text-[26px] text-[#0B1739]">
                                    Character Traits Assessment
                                </h2>
                                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-slate-500">
                                    {correctCount >= 16
                                        ? "Excellent work — you have a strong grasp of character traits."
                                        : correctCount >= 11
                                            ? "Good effort. Review the questions you missed to strengthen your understanding."
                                            : "Keep practising. Review each explanation below to build your understanding of character traits."}
                                </p>
                                <button
                                    onClick={handleRetake}
                                    className="mt-5 rounded-full border border-[#0B1739] px-6 py-2.5 text-[13px] font-medium text-[#0B1739] transition hover:bg-[#0B1739] hover:text-white"
                                >
                                    Retake assessment
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Progress / intro */}
                {!submitted && (
                    <div className="mb-10">
                        <h1 className="font-[Playfair_Display] text-[32px] text-[#0B1739]">
                            Character Traits Assessment
                        </h1>
                        <p className="mt-3 text-[15px] text-slate-500">
                            Choose the character trait that best describes the person in each
                            situation.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E1D8]">
                                <div
                                    className="h-full rounded-full bg-[#C6A24D] transition-all duration-500 ease-out"
                                    style={{ width: `${(answeredCount / total) * 100}%` }}
                                />
                            </div>
                            <span className="shrink-0 text-[12px] font-medium tabular-nums text-slate-500">
                                {answeredCount} / {total}
                            </span>
                        </div>
                    </div>
                )}

                {/* Questions */}
                <ol className="space-y-6">
                    {QUESTIONS.map((q, index) => {
                        const selected = answers[q.id];
                        const isCorrect = selected === q.answer;

                        return (
                            <li
                                key={q.id}
                                className="rounded-2xl border border-[#E5E1D8] bg-white p-6 shadow-sm sm:p-7"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1739] text-[13px] font-semibold text-white">
                                        {index + 1}
                                    </span>
                                    <p className="pt-1 text-[15px] leading-relaxed text-[#0B1739]">
                                        {q.text}
                                    </p>
                                </div>

                                <div className="mt-5 grid gap-3 pl-0 sm:pl-12">
                                    {q.options.map((opt) => {
                                        const isSelected = selected === opt.key;
                                        const isAnswerKey = q.answer === opt.key;

                                        let optionClasses =
                                            "border-[#E5E1D8] bg-[#FDFCF9] text-slate-700 hover:border-[#C6A24D]";

                                        if (submitted) {
                                            if (isAnswerKey) {
                                                optionClasses =
                                                    "border-emerald-400 bg-emerald-50 text-emerald-900";
                                            } else if (isSelected && !isAnswerKey) {
                                                optionClasses =
                                                    "border-rose-300 bg-rose-50 text-rose-900";
                                            } else {
                                                optionClasses =
                                                    "border-[#E5E1D8] bg-[#FDFCF9] text-slate-400";
                                            }
                                        } else if (isSelected) {
                                            optionClasses =
                                                "border-[#C6A24D] bg-[#C6A24D]/10 text-[#0B1739]";
                                        }

                                        return (
                                            <button
                                                key={opt.key}
                                                type="button"
                                                onClick={() => selectAnswer(q.id, opt.key)}
                                                disabled={submitted}
                                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition ${optionClasses} ${submitted ? "cursor-default" : "cursor-pointer"
                                                    }`}
                                            >
                                                <span
                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${isSelected || (submitted && isAnswerKey)
                                                            ? "border-current"
                                                            : "border-slate-300"
                                                        }`}
                                                >
                                                    {opt.key}
                                                </span>
                                                <span className="flex-1">{opt.text}</span>
                                                {submitted && isAnswerKey && (
                                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                                                        Correct
                                                    </span>
                                                )}
                                                {submitted && isSelected && !isAnswerKey && (
                                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-rose-500">
                                                        Your answer
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </li>
                        );
                    })}
                </ol>

                {/* Submit */}
                {!submitted && (
                    <div className="mt-12 flex flex-col items-center gap-4">
                        {!allAnswered && (
                            <p className="text-[13px] text-slate-400">
                                Answer all {total} questions to see your results.
                            </p>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={`rounded-full px-10 py-3.5 text-[14px] font-medium transition ${allAnswered
                                    ? "bg-[#0B1739] text-white hover:bg-[#16264f]"
                                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                                }`}
                        >
                            Submit assessment
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}