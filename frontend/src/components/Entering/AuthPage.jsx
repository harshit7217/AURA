import { useState } from "react";
import Register from "./Register.jsx"
import Login from "./Login.jsx";

const AuthPage = () => {
    const [isRegisterPage, setIsRegisterPage] = useState(true);

    const handleToogleRegisterPage = () => {
        setIsRegisterPage(!isRegisterPage);
    }
    return (
        <div className="flex min-h-screen items-stretch justify-center bg-light sm:items-center sm:p-4">
      <div className="w-full bg-white px-5 py-8 text-dark sm:max-w-105 sm:rounded-2xl sm:border sm:border-accent sm:px-7 sm:shadow-xl sm:shadow-dark/10">
        <h1 className="mb-1 text-center text-2xl font-bold sm:text-3xl">
          {isRegisterPage ? "Create account" : "Welcome back"}
        </h1>
        <p className="mb-6 text-center text-sm text-dark/70">
          {isRegisterPage ? "Sign up to get started" : "Log in to continue"}
        </p>

        {/* Tab switch */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-light p-1">
          <button
            onClick={() => isRegisterPage && handleToogleRegisterPage()}
            className={`rounded-lg py-2.5 font-semibold transition-colors ${
              !isRegisterPage
                ? "bg-dark text-white"
                : "text-dark hover:bg-accent"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => !isRegisterPage && handleToogleRegisterPage()}
            className={`rounded-lg py-2.5 font-semibold transition-colors ${
              isRegisterPage
                ? "bg-dark text-white"
                : "text-dark hover:bg-accent"
            }`}
          >
            Register
          </button>
        </div>

        {isRegisterPage ? <Register /> : <Login />}
      </div>
    </div>
    )
}

export default AuthPage;