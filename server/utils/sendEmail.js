import nodemailer from "nodemailer"

// ── Create a reusable transporter ────────────────────────────────────────
// This is the "mail carrier" — it logs into your Gmail account using the
// App Password and is ready to send emails through it.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// ── Send password reset email ────────────────────────────────────────────
export const sendResetEmail = async (toEmail, resetUrl) => {
  const mailOptions = {
    from: `"SpendWise" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your SpendWise password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #7c3aed;">Reset Your Password</h2>
        <p>You requested a password reset for your SpendWise account.</p>
        <p>Click the button below to set a new password. This link expires in 30 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #7c3aed; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #6b7280; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #6b7280; font-size: 13px;">Or copy this link: ${resetUrl}</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
