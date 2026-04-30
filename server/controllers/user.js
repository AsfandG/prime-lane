import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateToken, sendEmail } from "../utils/utils.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. check existing user
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      if (!existinguser.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        existinguser.verificationOtp = otp;
        existinguser.verificationOtpExpires = Date.now() + 10 * 60 * 1000;

        await existinguser.save();
        await sendEmail(
          email,
          "Verify your email",
          `<h2>Your OTP is ${otp}</h2>`,
        );
        return res.status(200).json({
          message: "OTP resent to email. Please verify your account.",
        });
      }
      return res.status(400).json({ message: "User already exist" });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 3. Generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // 4. create user (unverified)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationOtp: otp,
      verificationOtpExpires: Date.now() + 60 * 60 * 1000,
    });

    // 5. Send Otp email
    const message = `<h2>Welcome to Prime-Lane, ${name}! </h2>
      <p> Your OTP for prime-lane registration is ${otp}</p>`;
    await sendEmail(email, "Verify your email", message);

    // 6. Response
    res.status(200).json({
      message: "User registered. Please verify Otp send to your email.",
      email: newUser.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify your email first" });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Get Users
export const getUsers = async (req, res) => {
  try {
    const [users, count] = await Promise.all([
      User.find().select("-password"),
      User.countDocuments(),
    ]);
    res.json({ totalUsers: count, users });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "invalid request" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Already Verified" });
    }

    if (!user.verificationOtp) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one." });
    }

    if (Date.now() > user.verificationOtpExpires) {
      return res.status(400).json({ message: "Otp Expired!" });
    }

    if (user.verificationOtp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
