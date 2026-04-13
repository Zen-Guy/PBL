import nodemailer from "nodemailer";

export async function sendReminderEmail(to: string, name: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not configured. Skipping email to " + to);
    console.warn("Please add them to the .env file to enable real emails.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"MindfulPath" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Time for your Mental Health Check-in! 🧠",
      text: `Hi ${name},\n\nIt's time for your weekly mental health check-in. Please log in to MindfulPath and take 2 minutes to complete your quiz and track your progress.\n\nTake care,\nMindfulPath Team`,
      html: `<p>Hi ${name},</p><p>It's time for your weekly mental health check-in. Please log in to MindfulPath and take 2 minutes to complete your quiz and track your progress.</p><p>Take care,<br>MindfulPath Team</p>`,
    });
    console.log("Reminder sent to: %s [Message ID: %s]", to, info.messageId);
  } catch (error) {
    console.error("Error sending email reminder to " + to + ": ", error);
  }
}
