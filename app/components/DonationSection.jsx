"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";

export default function DonationSection() {
  const [totalMoney, setTotalMoney] = useState(50000);
  const [totalPeople, setTotalPeople] = useState(200);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalMoney((prev) => prev + Math.floor(Math.random() * 1000));
      setTotalPeople((prev) => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-xl shadow-2xl text-white overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Section */}
        <div className="flex-1 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-xl">
            “Your small help can change someone's life forever.”
          </h2>
          <p className="mt-6 text-lg text-indigo-200 max-w-md">
            Join thousands of generous donors making a real impact every day. Your contribution matters.
          </p>

          <button
            className="mt-8 px-8 py-3 text-lg bg-gradient-to-r from-green-400 to-lime-500 rounded-xl shadow-lg hover:from-green-500 hover:to-lime-600 transition duration-300 font-semibold text-white ring-2 ring-white/10 hover:scale-105"
          >
            💖 Login to Donate
          </button>
        </div>

        {/* Right Stats & QR Card */}
        <div className="flex-1 flex flex-col gap-10 md:gap-12 items-center md:items-end w-full max-w-md">
          {/* Live Stats */}
          <div className="flex flex-wrap gap-8 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl px-8 py-10 shadow-lg w-full justify-center border border-white/20">
            {/* Total Money */}
            <div className="flex flex-col items-center w-40">
              <div className="mb-2 h-1.5 w-12 rounded-full bg-indigo-500"></div>
              <p
                className="text-4xl font-extrabold text-green-400 drop-shadow-md font-mono w-full text-center select-text"
                style={{ letterSpacing: '0.04em' }}
              >
                <CountUp
                  end={totalMoney}
                  duration={1.5}
                  separator=","
                  prefix="₹"
                />
              </p>
              <p className="mt-2 text-indigo-200 font-medium tracking-wide uppercase text-center select-none">
                Total Money Donated
              </p>
            </div>

            {/* Total People */}
            <div className="flex flex-col items-center w-32">
              <div className="mb-2 h-1.5 w-8 rounded-full bg-blue-400"></div>
              <p
                className="text-4xl font-extrabold text-blue-400 drop-shadow-md font-mono w-full text-center select-text"
                style={{ letterSpacing: '0.04em' }}
              >
                <CountUp
                  end={totalPeople}
                  duration={1.5}
                  separator=","
                />
              </p>
              <p className="mt-2 text-indigo-200 font-medium tracking-wide uppercase text-center select-none">
                Total People Donated
              </p>
            </div>
          </div>

          {/* Tilt + Glow QR Card */}
          <div className="relative group hover:scale-[1.02] transition-transform duration-500 ease-in-out w-full max-w-sm">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>

            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#ffffff"
              glarePosition="all"
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              scale={1.02}
              transitionSpeed={1500}
              className="relative z-10 rounded-2xl"
            >
              <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 overflow-hidden shadow-2xl">
                <a href="#">
                  <img
                    className="rounded-t-2xl w-full object-contain p-8 bg-white/20 backdrop-blur-sm"
                    src="https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png"
                    alt="QR Code"
                  />
                </a>
                <div className="px-6 pb-6">
                  <h5 className="text-xl font-semibold tracking-tight text-white">
                    Donate via UPI QR Code
                  </h5>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg text-indigo-300">Scan & Contribute</span>
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </div>
      </div>
    </section>
  );
}
