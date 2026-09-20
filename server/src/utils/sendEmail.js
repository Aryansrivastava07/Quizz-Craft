import nodemailer from "nodemailer";

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,              // ✅ important
    secure: false,          // ✅ must be false for 587
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD, // ✅ use app password
    },
    tls: {
      rejectUnauthorized: false, // ✅ avoids SSL issues on Render
    },
    connectionTimeout: 10000, // ✅ 10 sec timeout
  });
};

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error("❌ Email error:", error);
    return { success: false, error: error.message };
  }
};

export default sendEmail;
