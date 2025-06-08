"use client";
import { useState } from "react";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null; // Hide if not open

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white rounded-xl shadow-2xl transform -translate-x-1/2 -translate-y-1/2 z-50">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-semibold rounded-lg ${
              isLogin
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-semibold rounded-lg ${
              !isLogin
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? <LoginForm /> : <SignupForm />}
      </div>
    </>
  );
}

function LoginForm() {
  return (
    <form className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Login
      </button>
    </form>
  );
}

function SignupForm() {
  return (
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Sign Up
      </button>
    </form>
  );
}
