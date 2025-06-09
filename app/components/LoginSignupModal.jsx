"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginSignupModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    confirmPassword: "",
  });
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const url = isLogin ? "/api/login" : "/api/signup";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      alert(data.message);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        login(data.user, data.token);

        setForm({
          name: "",
          email: "",
          password: "",
          number: "",
          confirmPassword: "",
        });
        onClose();
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <button
          className="absolute top-4 right-4 text-black"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                required
                className="input border border-black px-4 py-2 rounded text-black"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.number}
                required
                pattern="[0-9]{10}"
                className="input border border-black px-4 py-2 rounded text-black"
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            required
            className="input border border-black px-4 py-2 rounded text-black"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            required
            className="input border border-black px-4 py-2 rounded text-black"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              required
              className="input border border-black px-4 py-2 rounded text-black"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          )}
         {/* Show error message only when passwords don't match */}
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-600 text-sm">
                  Passwords do not match.
                </p>
              )}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
