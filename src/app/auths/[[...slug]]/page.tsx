// pages/auth/[[...slug]].js
"use client"
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function Auth() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync URL with state
  useEffect(() => {
    const slug = params?.slug;
    if (slug && Array.isArray(slug) && slug.length > 0) {
      if (slug[0] === "signup") {
        setAuthMode("signup");
      } else if (slug[0] === "forgot-password") {
        setAuthMode("forgot-password");
      } else {
        setAuthMode("login");
      }
    } else {
      setAuthMode("login");
    }
  }, [params]);

 // Update URL when state changes
  const updateAuthMode = (mode: 'login' | 'signup' | 'forgot-password') => {
    setAuthMode(mode);
    if (mode === "login") {
      router.push("/auths");
    } else {
      router.push(`/auths/${mode}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authMode === "login") {
      console.log("Login", { email, password });
    } else if (authMode === "signup") {
      console.log("Signup", { email, password, name });
    } else if (authMode === "forgot-password") {
      console.log("Forgot Password", { email });
      setIsSubmitted(true);
    }
  };

  const handleGoogleAuth = () => {
    console.log("Google authentication initiated");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center background py-6 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>
          {authMode === "login" ? "Login" : authMode === "signup" ? "Sign Up" : "Forgot Password"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <nav className="bg-black p-4 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wide text-white emblema-one-regular">
            URLTRIM
          </h1>
        </div>
      </nav>

      <div className="w-full mt-1 md:mt-24 sm:w-1/3 montserrat bg-white shadow-md rounded-lg p-3 sm:p-8 border border-gray-200">
        <h2 className="text-center text-xl sm:text-xl font-extrabold text-gray-900">
          {authMode === "login" ? "Sign in to your account" : 
           authMode === "signup" ? "Create a new account" : 
           "Reset your password"}
        </h2>

        {authMode === "forgot-password" && isSubmitted ? (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              If an account exists with the email <span className="font-medium">{email}</span>,
              we've sent password reset instructions.
            </p>
            <button 
              onClick={() => updateAuthMode("login")}
              className="mt-4 text-black font-bold hover:text-gray-800 underline cursor-pointer"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
            {authMode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black">
                  Full Name
                </label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  autoComplete="name" 
                  required={authMode === "signup"} 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm sm:text-base" 
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-4 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm sm:text-base" 
              />
            </div>

            {authMode !== "forgot-password" && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete={authMode === "login" ? "current-password" : "new-password"} 
                  required={authMode !== "forgot-password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full px-4 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm sm:text-base" 
                />
              </div>
            )}

            {authMode === "login" && (
              <div className="flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => updateAuthMode("forgot-password")}
                  className="text-sm text-black underline font-bold hover:text-gray-700"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-1.5 font-bold text-sm cursor-pointer text-white bg-black hover:bg-gray-800 rounded-md shadow-sm sm:text-base"
            >
              {authMode === "login" ? "Sign in" : 
               authMode === "signup" ? "Sign up" : 
               "Reset password"}
            </button>
          </form>
        )}

        {authMode !== "forgot-password" && !isSubmitted && (
          <>
            {/* Divider */}
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-3 text-sm text-gray-500">Or continue with</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            {/* Google Sign-In Button */}
            <button 
              onClick={handleGoogleAuth} 
              className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              Sign {authMode === "login" ? "in" : "up"} with Google
            </button>
          </>
        )}

        {/* Toggle Login/Signup */}
        {(authMode === "login" || authMode === "signup") && !isSubmitted && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => updateAuthMode(authMode === "login" ? "signup" : "login")} 
                className="text-black font-bold hover:text-gray-800 underline cursor-pointer"
              >
                {authMode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        )}

        {/* Back to login from forgot password */}
        {authMode === "forgot-password" && !isSubmitted && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <button 
                type="button" 
                onClick={() => updateAuthMode("login")} 
                className="text-black font-bold hover:text-gray-800 underline cursor-pointer"
              >
                Back to login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}