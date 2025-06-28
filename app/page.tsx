"use client";

import { useState } from "react";

import Navbar from "./components/Navbar";
import DonationSection from "./components/DonationSection";
import About from "./components/About";
import Contact from "./components/Contact";
import LoginSignupModal from "./components/LoginSignupModal";
import NotificationForm from "./NotificationForm/page";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  // You can pass a function to Navbar to trigger modal open (optional)
  return (
    <>
      <Navbar openLoginModal={() => setModalOpen(true)} />

      <main className="max-w-7xl mx-auto py-12">
      
        <section id="home" className="scroll-mt-20">
          <DonationSection openLoginModal={() => setModalOpen(true)} />


        </section>

        <About />
        <Contact />

        <div className="h-20" /> {/* bottom spacing */}
      </main>

      <LoginSignupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
       
    </>
  );
}
