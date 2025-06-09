"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";
import { useAuth } from "../context/AuthContext";
import { QRCodeCanvas } from "qrcode.react";


import axios from "axios";
import Link from "next/link";


export default function DonationSection({openLoginModal}) {
  const { user } = useAuth();
  const [totalMoney, setTotalMoney] = useState(50000);
  const [totalPeople, setTotalPeople] = useState(200);
  const [paymentUrl, setPaymentUrl] = useState("");
  useEffect(() => {
  async function fetchPaymentURL() {
    if (!user) return;

    try {
      const res = await fetch(`/api/get-user-contributions?email=${encodeURIComponent(user.email)}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      if (data?.donations?.length > 0) {
        // You can take the latest donation by sorting here if needed:
        const latestDonation = data.donations.reduce((latest, current) =>
          new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
        );

        if (latestDonation.paymentUrl) {
          setPaymentUrl(latestDonation.paymentUrl);
        }
      } else {
        setPaymentUrl("");
      }
    } catch (error) {
      console.error("Error fetching payment URL:", error);
      setPaymentUrl("");
    }
  }

  fetchPaymentURL();
}, [user]);



  useEffect(() => {
    const interval = setInterval(() => {
      setTotalMoney((prev) => prev + Math.floor(Math.random() * 1000));
      setTotalPeople((prev) => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-xl shadow-2xl text-white overflow-hidden relative">
  {!user && (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center gap-4 text-center">
      <div className="animate-bounce-slow text-red-500 text-5xl">
        🔒
      </div>
      <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
        Please Log In to Donate
      </h3>
      <p className="text-indigo-200 max-w-sm animate-fade-in-slow">
        Login to unlock donation features, generate your unique QR code, and support someone in need.
      </p>
     
        <button  onClick={() => openLoginModal()}   className="mt-4 px-8 py-3 bg-gradient-to-r from-green-400 to-lime-500 text-white font-bold text-lg rounded-full animate-pulse ring-2 ring-white/20 hover:scale-110 transition-transform duration-300">
          💖 Login to Donate
        </button>
      
    </div>
  )}

  <div className={`flex flex-col md:flex-row items-center justify-between gap-12 transition-opacity duration-500 ${!user ? "opacity-30 blur-sm pointer-events-none select-none" : "opacity-100"}`}>
    {/* Left Side */}
    <div className="flex-1 max-w-lg">
      <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-xl">
        “Your small help can change someone's life forever.”
      </h2>
      <p className="mt-6 text-lg text-indigo-200 max-w-md">
        Join thousands of generous donors making a real impact every day. Your contribution matters.
      </p>
      {user && (
         <Link href="/NotificationForm">
        <button
          onClick={() => document.getElementById("qr-section")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-8 px-8 py-3 text-lg bg-gradient-to-r from-green-400 to-lime-500 rounded-xl shadow-lg hover:from-green-500 hover:to-lime-600 transition duration-300 font-semibold text-white ring-2 ring-white/10 hover:scale-105"
        >
          💖 Set Notification
        </button>
        </Link>
      )}
    </div>

    {/* Right Side */}
    <div className="flex-1 flex flex-col gap-10 md:gap-12 items-center md:items-end w-full max-w-md">
      {/* Stats */}
      <div className="flex flex-wrap gap-8 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl px-8 py-10 shadow-lg w-full justify-center border border-white/20">
        <div className="flex flex-col items-center w-40">
          <div className="mb-2 h-1.5 w-12 rounded-full bg-indigo-500"></div>
          <p className="text-4xl font-extrabold text-green-400 drop-shadow-md font-mono w-full text-center select-text" style={{ letterSpacing: '0.04em' }}>
            <CountUp end={totalMoney} duration={1.5} separator="," prefix="₹" />
          </p>
          <p className="mt-2 text-indigo-200 font-medium tracking-wide uppercase text-center select-none">
            Total Money Donated
          </p>
        </div>
        <div className="flex flex-col items-center w-32">
          <div className="mb-2 h-1.5 w-8 rounded-full bg-blue-400"></div>
          <p className="text-4xl font-extrabold text-blue-400 drop-shadow-md font-mono w-full text-center select-text" style={{ letterSpacing: '0.04em' }}>
            <CountUp end={totalPeople} duration={1.5} separator="," />
          </p>
          <p className="mt-2 text-indigo-200 font-medium tracking-wide uppercase text-center select-none">
            Total People Donated
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div id="qr-section" className="w-full flex flex-col items-center gap-6">
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
            <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 overflow-hidden shadow-2xl text-center">
              <div className="p-6 bg-white/20 backdrop-blur-sm flex justify-center">
                {user && paymentUrl ? (
 <QRCodeCanvas value="Hello, world!" size={180} />

) : (
  <img src={paymentUrl || "/fallback-qr.png"} alt="Default QR" className="w-40" />
)}

              </div>
              <div className="px-6 pb-6">
                <h5 className="text-xl font-semibold tracking-tight text-white">
                  {user ? "Your Personal Donation QR" : "Scan to Donate"}
                </h5>
              </div>
            </div>
          </Tilt>
        </div>

        {/* Extra Payment Options */}
        <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Other Ways to Donate</h3>
          <ul className="space-y-2 text-indigo-200 text-sm font-medium">
            <li>• <b>UPI ID:</b> <span className="text-white">hopefoundation@upi</span></li>
            <li>• <b>Bank:</b> Hope Foundation - A/C No: 1234567890</li>
            <li>• <b>IFSC:</b> HDFC0001234</li>
            <li>• <b>PayPal:</b> <a href="https://paypal.me/hopefoundation" className="underline text-blue-300">paypal.me/hopefoundation</a></li>
            <li>• <b>Crypto:</b> Accepting BTC, ETH soon!</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

  );
}
