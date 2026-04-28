import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateToken, sendEmail } from "../utils/utils.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const message = `<h2>Welcome to Prime-Lane, ${name}! Your OTP for prime-lane registration is ${otp}</h2>`;
      await sendEmail(email, "Registration OTP", message);
      res.status(200).json({
        name: newUser._id,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    }
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
    res.status(200).json({ message: "server error", error: error.message });
  }
};

// Get Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ status: success, users });
  } catch (error) {
    res.status(200).json({ message: "server error", error: error.message });
  }
};
