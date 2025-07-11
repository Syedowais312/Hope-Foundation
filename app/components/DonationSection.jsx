"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";
import { useAuth } from "../context/AuthContext";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import Link from "next/link";

export default function DonationSection({ openLoginModal }) {
  const { user } = useAuth();
  const [totalMoney, setTotalMoney] = useState(50000);
  const [totalPeople, setTotalPeople] = useState(200);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchDonationStats() {
      try {
        const res = await fetch("/api/get-donation-stats");
        const data = await res.json();
        setTotalMoney(
          data.totalAmount || setTotalMoney((prev) => prev + Math.floor(Math.random() * 1000))
        );
        setTotalPeople(
          data.donationCount || setTotalPeople((prev) => prev + Math.floor(Math.random() * 5))
        );
      } catch (err) {
        console.error("Failed to fetch donation stats", err);
      }
    }

    fetchDonationStats();
    const interval = setInterval(fetchDonationStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async (order_id, amount) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      name: "Hope Foundation",
      description: "Donation",
      image: "/logo.png",
      order_id,
      handler: async function (response) {
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userEmail: user.email,
            }),
          });

          const result = await verifyRes.json();

          if (verifyRes.ok) {
            alert("✅ Thank you! Your donation was verified and recorded.");
          } else {
            alert("⚠️ Verification failed: " + result.error);
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Something went wrong during payment verification.");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#00b894",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const generatePaymentQR = async () => {
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setGenerating(true);
      const res = await axios.post("/api/create-payment", {
        amount: donationAmount,
      });

      const { id: order_id, amount } = res.data;

      const checkoutUrl = `${window.location.origin}/donate?order_id=${order_id}&amount=${amount}`;
      setPaymentUrl(checkoutUrl);

      openRazorpay(order_id, amount);
    } catch (err) {
      console.error("Error generating payment link:", err);
      alert("Failed to generate payment link.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-xl shadow-2xl text-white overflow-hidden relative">
      {!user && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center gap-4 text-center">
          <div className="animate-bounce-slow text-red-500 text-5xl">🔒</div>
          <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
            Please Log In to Donate
          </h3>
          <p className="text-indigo-200 max-w-sm animate-fade-in-slow">
            Login to unlock donation features, generate your unique QR code, and support someone in need.
          </p>
          <button
            onClick={() => openLoginModal()}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-green-400 to-lime-500 text-white font-bold text-lg rounded-full animate-pulse ring-2 ring-white/20 hover:scale-110 transition-transform duration-300"
          >
            💖 Login to Donate
          </button>
        </div>
      )}

      <div
        className={`flex flex-col md:flex-row items-center justify-between gap-12 transition-opacity duration-500 ${
          !user ? "opacity-30 blur-sm pointer-events-none select-none" : "opacity-100"
        }`}
      >
        <div className="flex-1 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-xl">
            “Your small help can change someone's life forever.”
          </h2>
          <p className="mt-6 text-lg text-indigo-200 max-w-md">
            Join thousands of generous donors making a real impact every day. Your contribution matters.
          </p>
          {user && (
            <Link href="/NotificationForm">
              <button className="mt-8 px-8 py-3 text-lg bg-gradient-to-r from-green-400 to-lime-500 rounded-xl shadow-lg hover:from-green-500 hover:to-lime-600 transition duration-300 font-semibold text-white ring-2 ring-white/10 hover:scale-105">
                💖 Set Notification
              </button>
            </Link>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-10 md:gap-12 items-center md:items-end w-full max-w-md">
          <div className="flex flex-wrap gap-8 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl px-8 py-10 shadow-lg w-full justify-center border border-white/20">
            <div className="flex flex-col items-center w-40">
              <div className="mb-2 h-1.5 w-12 rounded-full bg-indigo-500"></div>
              <p className="text-4xl font-extrabold text-green-400 drop-shadow-md font-mono w-full text-center select-text">
                <CountUp end={totalMoney} duration={1.5} separator="," prefix="₹" />
              </p>
              <p className="mt-2 text-indigo-200 font-medium tracking-wide uppercase text-center select-none">
                Total Money Donated
              </p>
            </div>
            <div className="flex flex-col items-center w-32">
              <div className="mb-2 h-1.5 w-8 rounded-full bg-blue-400"></div>
              <p className="text-4xl font-extrabold text-blue-400 drop-shadow-md font-mono w-full text-center select-text">
                <CountUp end={totalPeople} duration={1.5} separator="," />
              </p>
              <p className="mt-2 text-indigo-200 font-medium tracking-wide uppercase text-center select-none">
                Total People Donated
              </p>
            </div>
          </div>

          <div id="qr-section" className="w-full max-w-md">
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#fff"
              glarePosition="all"
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              scale={1.01}
              transitionSpeed={1500}
              className="rounded-xl"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg p-6 text-center space-y-4">
                <div className="bg-white/20 p-4 rounded-xl flex justify-center">
                  {user && paymentUrl ? (
                    <QRCodeCanvas
                        value={paymentUrl ?? "https://razorpay.com/"}

                      size={200}
                      level="H"
                      fgColor="#000000"
                      bgColor="transparent"
                    />
                  ) : (
                    <p className="text-white">No QR Available</p>
                  )}
                </div>

                {user && (
                  <>
                    <input
                      type="number"
                      placeholder="Enter custom amount (₹)"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full p-2 rounded bg-white/90 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-lime-400"
                      min="1"
                    />
                    <button
                      onClick={generatePaymentQR}
                      disabled={generating || !donationAmount}
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded font-semibold disabled:opacity-50 hover:scale-105 transition"
                    >
                      {generating ? "Generating..." : "Donate with Razorpay"}
                    </button>
                  </>
                )}
              </div>
            </Tilt>
          </div>

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
    </section>
  );
}
