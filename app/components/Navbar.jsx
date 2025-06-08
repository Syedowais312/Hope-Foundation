"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // 👈 import it

export default function Navbar({ openLoginModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // 👈 use context instead of local state

  const handleLogout = () => {
    logout(); // 👈 will clear token & user
    alert("Logged out successfully!");
  };

  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 px-6 md:px-10">

        {/* Logo */}
        <Link href="#home" onClick={handleLinkClick} className="flex items-center space-x-3 text-white text-2xl font-bold">
          <img src="https://cdn-icons-png.flaticon.com/512/6840/6840478.png" alt="Logo" className="h-8 w-8" />
          <span className="text-purple-300 tracking-wider">Hope Foundation</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-gray-200 font-medium">
          <a href="#home" onClick={handleLinkClick} className="hover:text-purple-400 transition duration-300">Home</a>
          <a href="#about" onClick={handleLinkClick} className="hover:text-purple-400 transition duration-300">About</a>
          <a href="#contact" onClick={handleLinkClick} className="hover:text-purple-400 transition duration-300">Contact</a>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? ( // 👈 use AuthContext's user value
            <>
              <Link href="/my-contribution">
                <button className="px-4 py-2 bg-purple-700 rounded-lg text-white hover:bg-purple-800 transition">
                  My Contribution
                </button>
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition">
                Logout
              </button>
            </>
          ) : (
            <button onClick={openLoginModal} className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition">
              Login / SignUp
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur border-t border-white/20 text-white">
          <a href="#home" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/20 transition">Home</a>
          <a href="#about" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/20 transition">About</a>
          <a href="#contact" onClick={handleLinkClick} className="block px-4 py-3 hover:bg-white/20 transition">Contact</a>

          <div className="border-t border-white/20 mt-2 pt-2 px-4">
            {user ? (
              <>
                <Link href="/my-contribution">
                  <button onClick={() => setIsOpen(false)} className="w-full mb-2 px-4 py-2 bg-purple-700 rounded-lg text-white hover:bg-purple-800 transition">
                    My Contribution
                  </button>
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => { openLoginModal(); setIsOpen(false); }} className="w-full px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition">
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
