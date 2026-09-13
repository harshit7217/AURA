import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Aura Academy — Sign in / Register
 * Talks to:
 *   POST /api/users/register  { firstName, lastName, email, password }
 *   POST /api/users/login     { email, password }
 *     -> on success: { message, name, email }
 *
 * On successful login, navigates to /dashboard.
 */

const API_BASE = "http://localhost:8080/api/users";

function LaurelBranch({ flip = false }) {
    return (
        <svg
            viewBox="0 0 60 300"
            className={`h-full w-auto ${flip ? "scale-x-[-1]" : ""}`}
            fill="none"
        >
            {Array.from({ length: 9 }).map((_, i) => {
                const y = 20 + i * 30;
                return (
                    <g key={i} opacity={0.55 + (i % 3) * 0.1}>
                        <ellipse
                            cx={30 + (i % 2 === 0 ? 14 : 10)}
                            cy={y}
                            rx="13"
                            ry="6"
                            transform={`rotate(${-28 + (i % 2) * 6} ${30 + (i % 2 === 0 ? 14 : 10)} ${y})`}
                            fill="#C6A24D"
                        />
                    </g>
                );
            })}
            <path
                d="M30 10 C 26 90, 26 210, 30 290"
                stroke="#C6A24D"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function TorchMark() {
    return (
        <svg viewBox="0 0 64 64" className="h-10 w-10">
            <path
                d="M32 6c5 6 8 10 8 15a8 8 0 1 1-16 0c0-5 3-9 8-15Z"
                fill="#E8C468"
            />
            <rect x="28" y="26" width="8" height="22" rx="1.5" fill="#C6A24D" />
            <path d="M22 48h20l-3 8H25l-3-8Z" fill="#C6A24D" />
        </svg>
    );
}

function Field({ label, type, value, onChange, autoComplete, required = true }) {
    return (
        <label className="block">
            <span className="text-[11px] font-medium tracking-wide text-slate-500">
                {label}
            </span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required={required}
                className="mt-1.5 w-full border-0 border-b-[1.5px] border-slate-300 bg-transparent px-0.5 py-2 text-[15px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B1739]"
            />
        </label>
    );
}

export default function AuraAuth() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { kind: "ok" | "error", message }

    const [login, setLogin] = useState({ email: "", password: "" });
    const [reg, setReg] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const switchMode = (next) => {
        setMode(next);
        setStatus(null);
    };

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login),
            });
            const data = await res.json();

            if (res.ok) {
                // Placeholder session — swap for a real token once you add
                // JWT/session auth on the backend.
                localStorage.setItem("aura_user_name", data.name);
                localStorage.setItem("aura_user_email", data.email);
                navigate("/dashboard");
            } else {
                setStatus({ kind: "error", message: data.message || "Invalid email or password." });
            }
        } catch {
            setStatus({ kind: "error", message: "Couldn't reach the server. Is it running?" });
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reg),
            });
            const text = await res.text();
            if (res.ok) {
                setStatus({ kind: "ok", message: "Account created. You can sign in now." });
                setMode("login");
                setLogin({ email: reg.email, password: "" });
            } else {
                setStatus({ kind: "error", message: text || "Registration failed." });
            }
        } catch {
            setStatus({ kind: "error", message: "Couldn't reach the server. Is it running?" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#F7F5EF] font-[Inter] flex items-stretch">
            {/* Branding panel */}
            <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0B1739] to-[#132455] px-12 py-14 text-[#F7F5EF] lg:flex">
                <div className="pointer-events-none absolute inset-y-0 left-2 opacity-70">
                    <LaurelBranch />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-2 opacity-70">
                    <LaurelBranch flip />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <TorchMark />
                    <span className="font-[Playfair_Display] text-lg tracking-[0.15em] text-[#E8C468]">
                        AURA
                    </span>
                </div>

                <div className="relative z-10 mx-auto max-w-xs text-center">
                    <p className="font-[Playfair_Display] text-[13px] tracking-[0.35em] text-[#C6A24D]">
                        ACADEMY
                    </p>
                    <h1 className="mt-4 font-[Playfair_Display] text-[40px] leading-[1.15] text-white">
                        Where learning becomes leadership.
                    </h1>
                    <div className="mx-auto mt-6 h-px w-14 bg-[#C6A24D]" />
                    <p className="mt-6 text-[13px] tracking-[0.25em] text-[#B9C2DC]">
                        LEARN · LEAD · INSPIRE
                    </p>
                </div>

                <p className="relative z-10 text-[12px] leading-relaxed text-[#8391B5]">
                    Every course, every mentor, every milestone — one account away.
                </p>
            </div>

            {/* Form panel */}
            <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-10 lg:w-[58%] lg:px-24">
                <div className="mx-auto w-full max-w-sm">
                    {/* Mobile brand mark */}
                    <div className="mb-10 flex items-center gap-3 lg:hidden">
                        <TorchMark />
                        <span className="font-[Playfair_Display] text-[15px] tracking-[0.15em] text-[#0B1739]">
                            AURA ACADEMY
                        </span>
                    </div>

                    <h2 className="font-[Playfair_Display] text-[28px] text-[#0B1739]">
                        {mode === "login" ? "Sign in to your account" : "Create your account"}
                    </h2>
                    <p className="mt-2 text-[14px] text-slate-500">
                        {mode === "login"
                            ? "Continue your path with Aura Academy."
                            : "Join the academy — it only takes a minute."}
                    </p>

                    {/* Tabs */}
                    <div className="mt-8 flex gap-6 border-b border-slate-200">
                        {["login", "register"].map((m) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={`relative pb-3 text-[13px] font-medium tracking-wide transition-colors ${mode === m ? "text-[#0B1739]" : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {m === "login" ? "Sign in" : "Register"}
                                {mode === m && (
                                    <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#C6A24D]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {status && (
                        <div
                            className={`mt-6 border-l-2 px-4 py-3 text-[13px] ${status.kind === "ok"
                                    ? "border-[#C6A24D] bg-[#FBF6E9] text-[#6b5417]"
                                    : "border-red-400 bg-red-50 text-red-700"
                                }`}
                        >
                            {status.message}
                        </div>
                    )}

                    {mode === "login" ? (
                        <form onSubmit={handleLogin} className="mt-8 space-y-6">
                            <Field
                                label="EMAIL"
                                type="email"
                                autoComplete="email"
                                value={login.email}
                                onChange={(e) => setLogin({ ...login, email: e.target.value })}
                            />
                            <Field
                                label="PASSWORD"
                                type="password"
                                autoComplete="current-password"
                                value={login.password}
                                onChange={(e) => setLogin({ ...login, password: e.target.value })}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full bg-[#0B1739] py-3 text-[13px] font-medium tracking-[0.15em] text-[#F7F5EF] transition-colors hover:bg-[#132455] disabled:opacity-60"
                            >
                                {loading ? "SIGNING IN…" : "SIGN IN"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="mt-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="FIRST NAME"
                                    type="text"
                                    autoComplete="given-name"
                                    value={reg.firstName}
                                    onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                                />
                                <Field
                                    label="LAST NAME"
                                    type="text"
                                    autoComplete="family-name"
                                    value={reg.lastName}
                                    onChange={(e) => setReg({ ...reg, lastName: e.target.value })}
                                />
                            </div>
                            <Field
                                label="EMAIL"
                                type="email"
                                autoComplete="email"
                                value={reg.email}
                                onChange={(e) => setReg({ ...reg, email: e.target.value })}
                            />
                            <Field
                                label="PASSWORD"
                                type="password"
                                autoComplete="new-password"
                                value={reg.password}
                                onChange={(e) => setReg({ ...reg, password: e.target.value })}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full bg-[#0B1739] py-3 text-[13px] font-medium tracking-[0.15em] text-[#F7F5EF] transition-colors hover:bg-[#132455] disabled:opacity-60"
                            >
                                {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
                            </button>
                        </form>
                    )}

                    <p className="mt-8 text-center text-[13px] text-slate-500">
                        {mode === "login" ? (
                            <>
                                New to Aura?{" "}
                                <button
                                    onClick={() => switchMode("register")}
                                    className="font-medium text-[#0B1739] underline decoration-[#C6A24D] decoration-2 underline-offset-4"
                                >
                                    Create an account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => switchMode("login")}
                                    className="font-medium text-[#0B1739] underline decoration-[#C6A24D] decoration-2 underline-offset-4"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}