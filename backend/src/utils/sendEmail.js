import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an OTP email.
 * @param {string} to   – recipient email
 * @param {string} otp  – plain-text OTP code
 * @param {"registration"|"reset"} purpose
 */
const sendOtpEmail = async (to, otp, purpose) => {
  const isRegister = purpose === "registration";

  const subject = isRegister
    ? "Workvion – Verify your email"
    : "Workvion – Password reset code";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#16a34a;margin:0 0 16px">Workvion</h2>
      <p>Your ${isRegister ? "email verification" : "password reset"} code is:</p>
      <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;
                  padding:16px;background:#f0fdf4;border-radius:8px;margin:16px 0;color:#15803d">
        ${otp}
      </div>
      <p style="color:#6b7280;font-size:14px">This code expires in <strong>10 minutes</strong>.</p>
      <p style="color:#6b7280;font-size:14px">If you didn't request this, ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

/**
 * Send a leave-status notification email.
 * @param {string} to        – recipient email
 * @param {string} name      – employee's full name
 * @param {"approved"|"rejected"} status
 * @param {{ leaveType: string, startDate: Date, endDate: Date, totalDays: number }} leave
 */
export const sendLeaveStatusEmail = async (to, name, status, leave) => {
  const isApproved = status === "approved";
  const color = isApproved ? "#16a34a" : "#dc2626";
  const label = isApproved ? "Approved" : "Rejected";

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  const subject = `Workvion – Leave ${label}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="color:#16a34a;margin:0 0 16px">Workvion</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your leave request has been <span style="color:${color};font-weight:bold">${label}</span>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;color:#6b7280">Type</td><td style="padding:8px;font-weight:bold">${leave.leaveType}</td></tr>
        <tr><td style="padding:8px;color:#6b7280">From</td><td style="padding:8px">${formatDate(leave.startDate)}</td></tr>
        <tr><td style="padding:8px;color:#6b7280">To</td><td style="padding:8px">${formatDate(leave.endDate)}</td></tr>
        <tr><td style="padding:8px;color:#6b7280">Days</td><td style="padding:8px">${leave.totalDays}</td></tr>
      </table>
      <p style="color:#6b7280;font-size:14px">Log in to Workvion for more details.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

export default sendOtpEmail;
