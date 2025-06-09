"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function NotificationForm() {
  const { user } = useAuth();
  const [frequency, setFrequency] = useState("weekly");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/notification/set-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          frequency,
          message,
        }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Failed to set reminder. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 px-4">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-gray-900">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
          Donation Reminder
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="frequency"
              className="block text-lg font-semibold mb-2"
            >
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-lg font-semibold mb-2"
            >
              Custom Message
            </label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g. Time to donate 💖"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-extrabold text-white text-xl shadow-lg transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Setting..." : "Set Reminder"}
          </button>
        </form>
      </div>
    </div>
  );
}
