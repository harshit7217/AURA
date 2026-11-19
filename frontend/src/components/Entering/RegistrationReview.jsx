import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api.js";

const RegistrationReview = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");

    const reviewRequest = async (decision) => {
        setSubmitting(true);
        setError("");
        try {
            const result = await apiRequest("/api/junior-candidates/registration-approval", {
                method: "POST",
                body: JSON.stringify({ token, decision }),
            });
            setMessage(result.message);
            navigate("/registration-review", { replace: true });
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
            <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
                <p className="text-sm font-semibold text-indigo-600">AURA Academy</p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">Review candidate request</h1>
                <p className="mt-3 text-sm text-gray-600">
                    Choose whether to approve this registration request. Approval allows the candidate to log in.
                    Rejected candidates can submit a new request.
                </p>

                {message ? (
                    <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700" role="status">
                        {message}
                    </div>
                ) : (
                    <>
                        {!token && (
                            <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                This review link is missing its token. Open the link from the latest approval email.
                            </p>
                        )}
                        {error && (
                            <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </p>
                        )}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                disabled={!token || submitting}
                                onClick={() => reviewRequest("approve")}
                                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "Processing..." : "Approve"}
                            </button>
                            <button
                                type="button"
                                disabled={!token || submitting}
                                onClick={() => reviewRequest("reject")}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reject
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Return to sign in
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default RegistrationReview;
