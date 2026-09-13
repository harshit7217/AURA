import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const name = localStorage.getItem("aura_user_name");

    function handleLogout() {
        localStorage.removeItem("aura_user_name");
        localStorage.removeItem("aura_user_email");
        navigate("/");
    }

    function handleAssessment() {
        navigate("/assessment");
    }

    return (
        <div className="min-h-screen w-full bg-[#F7F5EF] font-[Inter]">
            <header className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
                <span className="font-[Playfair_Display] text-[15px] tracking-[0.15em] text-[#0B1739]">
                    AURA ACADEMY
                </span>
                <button
                    onClick={handleLogout}
                    className="text-[13px] font-medium text-slate-500 underline decoration-[#C6A24D] decoration-2 underline-offset-4 hover:text-[#0B1739]"
                >
                    Sign out
                </button>
            </header>

            <main className="mx-auto max-w-3xl px-8 py-16">
                <h1 className="font-[Playfair_Display] text-[32px] text-[#0B1739]">
                    Welcome back{name ? `, ${name}` : ""}.
                </h1>
                <p className="mt-3 text-[15px] text-slate-500">
                    You're signed in. This is where your courses, progress, and
                    announcements will live.
                </p>

                <button
                    onClick={handleAssessment}
                    className="mt-8 inline-flex items-center gap-2 border-l-2 border-[#C6A24D] bg-white px-5 py-4 text-[14px] font-medium text-[#0B1739] shadow-sm transition-colors hover:bg-[#FBF6E9] color:black"
                >
                    Take your placement assessment
                </button>
            </main>
        </div>
    );
}