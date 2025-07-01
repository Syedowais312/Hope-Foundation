// /lib/email/sendReminderEmail.js
export async function sendReminderEmail({ to, subject, body }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Hope Foundation", email: "syedowais@312sfmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: `<html><body><h2>${subject}</h2><p>${body}</p></body></html>`,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("❌ Brevo error:", error);
    throw new Error("Failed to send email");
  }
}
