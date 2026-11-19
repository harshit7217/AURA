import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api.js";

const initialForm = { email: "", password: "" };

const validate = ({ email, password }) => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";
    return errors;
};

const Login = ({ setIsRegisterPage }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setStatus(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(form);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setStatus(null);
        try {
            const data = await apiRequest("/api/junior-candidates/login", {
                method: "POST",
                body: JSON.stringify({
                    email: form.email.trim(),
                    password: form.password,
                }),
            });

            if (data.token) localStorage.setItem("token", data.token);

            setStatus({ type: "success", message: data.message || "Logged in successfully!" });
            setForm(initialForm);

            navigate("/junior-dashboard");
        } catch (err) {
            setStatus({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${errors[field]
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
        }`;

    return (
        <div className="flex min-h-130 items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800">Candidate Login</h1>
                <p className="mt-1 mb-6 text-sm text-gray-500">
                    Welcome back! Sign in to continue.
                </p>

                {status && (
                    <div
                        role="alert"
                        className={`mb-4 rounded-lg px-4 py-3 text-sm ${status.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                            }`}
                    >
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            className={inputClass("email")}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                className={`${inputClass("password")} pr-16`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute inset-y-0 right-3 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <button className="font-medium text-indigo-600 hover:text-indigo-800" onClick={() => setIsRegisterPage(true)}>
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;