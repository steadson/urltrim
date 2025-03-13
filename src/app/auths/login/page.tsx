// pages/auth.js
"use client"
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(isLogin ? "Login" : "Signup", { email, password, name });
  };

  const handleGoogleAuth = () => {
    console.log("Google authentication initiated");
  };

  return <div className="min-h-screen flex flex-col justify-center items-center background py-6 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>
          {isLogin ? "Login" : "Sign Up"}
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

      <div className="w-full mt-1 md:mt-24 sm:w-1/3 montserrat bg-white shadow-md rounded-lg p-3  sm:p-8 border border-gray-200">
        <h2 className="text-center text-xl sm:text-xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>

        <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
          {!isLogin && <div>
              <label htmlFor="name" className="block text-sm font-medium text-black">
                Full Name
              </label>
              <input id="name" name="name" type="text" autoComplete="name" required={!isLogin} value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm sm:text-base" />
            </div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email address
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-1.5 border border-gray-300 rounded-md  focus:ring-black focus:border-black text-sm sm:text-base" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-1.5 border border-gray-300 rounded-md  focus:ring-black focus:border-black text-sm sm:text-base" />
          </div>

          {isLogin && <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-black underline font-bold hover:text-gray-700">
                Forgot your password?
              </Link>
            </div>}

          <button type="submit" className="w-full py-1.5 font-bold text-sm cursor-pointer text-white bg-black hover:bg-gray-800 rounded-md shadow-sm  sm:text-base">
            {isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-sm text-gray-500">Or continue with</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Sign-In Button */}
        <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm">
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
          Sign in with Google
        </button>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-black font-bold hover:text-gray-800 underline cursor-pointer">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>;
}
