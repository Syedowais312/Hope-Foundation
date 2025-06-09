"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import Link from "next/link";

export default function MyContributionPage() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser?.email) {
      fetch(`/api/get-user-contributions?email=${storedUser.email}`)
        .then((res) => res.json())
        .then((data) => setDonations(data.donations || []))
        .catch(() => alert("Failed to load donations")
      );
    }
  }, []);

  function generatePDF(donation, user) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Hope Foundation", 20, 20);

    doc.setFontSize(14);
    doc.text("Donation Receipt", 20, 30);

    doc.setFontSize(12);
    doc.text(`Name: ${user?.name || "N/A"}`, 20, 50);
    doc.text(`Email: ${user?.email || "N/A"}`, 20, 60);
    doc.text(`Phone: ${donation.phone || "N/A"}`, 20, 70);
    doc.text(`Date: ${new Date(donation.createdAt).toLocaleString()}`, 20, 80);
    doc.text(`Payment URL:`, 20, 90);
    doc.text(donation.paymentUrl || "N/A", 20, 100);

    doc.text("Thank you for your generous support!", 20, 120);

    doc.save(`Donation_Receipt_${new Date(donation.createdAt).toISOString()}.pdf`);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Contributions</h1>

      {donations.length === 0 ? (

       
        <> <p className="text-gray-600">No contributions found.</p>
        <Link href="/">
        <button  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          > Back </button></Link>
        
        </>
        
      ) : (
        donations.map((donation) => (
          <div
            key={donation._id}
            className="border p-4 rounded mb-4 shadow"
          >
            <p><strong>Name:</strong> {donation.name}</p>
            <p><strong>Email:</strong> {donation.email}</p>
            <p><strong>Phone:</strong> {donation.phone}</p>
            <p><strong>Date:</strong> {new Date(donation.createdAt).toLocaleString()}</p>
            <p>
              <strong>Payment URL:</strong>{" "}
              <a
                href={donation.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>
            </p>

            <button
              onClick={() => generatePDF(donation, user)}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download Receipt (PDF)
            </button>
          </div>
        ))
      )}
    </div>
  );
}
