import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail({ to, subject, body }) {
  try {
    return await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: `<p>${body}</p><br/><a href="https://yourwebsite.com">Donate Now 💖</a>`,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return null;
  }
}
