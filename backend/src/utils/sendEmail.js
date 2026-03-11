const emailTimeoutMs = Number(process.env.EMAIL_TIMEOUT_MS) || 10000;
const brevoApiUrl = "https://api.brevo.com/v3/smtp/email";

const getSender = () => {
  const email = process.env.BREVO_SENDER_EMAIL;
  const name = process.env.BREVO_SENDER_NAME || "Workvion";

  if (!process.env.BREVO_API_KEY) {
    throw new Error("Missing BREVO_API_KEY environment variable");
  }

  if (!email) {
    throw new Error("Missing BREVO_SENDER_EMAIL environment variable");
  }

  return { email, name };
};

const sendEmail = async ({ to, subject, html }) => {
  const startedAt = Date.now();
  const response = await fetch(brevoApiUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: getSender(),
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
    signal: AbortSignal.timeout(emailTimeoutMs),
  });

  try {
    if (!response.ok) {
      const errorBody = await response.text();
      const error = new Error(`Brevo API request failed with status ${response.status}`);
      error.statusCode = 502;
      error.response = errorBody;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Email delivery failed", {
      message: error.message,
      code: error.code,
      response: error.response,
      durationMs: Date.now() - startedAt,
    });
    throw error;
  }
};

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

  await sendEmail({
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

  await sendEmail({
    to,
    subject,
    html,
  });
};

export default sendOtpEmail;
