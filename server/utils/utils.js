import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import resend from "../config/resend.js";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

export const sendEmail = async (to, subject, message) => {
  try {
    const data = await resend.emails.send({
      from: "prime-lane <onboarding@resend.dev>",
      to,
      subject,
      html: message,
    });

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Unable to send email");
  }
};
