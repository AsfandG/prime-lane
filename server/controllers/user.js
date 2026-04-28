import User from "../model/user";
import bcrypt from "bcryptjs";
import { generateToken, sendEmail } from "../utils/utils";

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
      const message = `Welcome to Prime-Lane, ${name}! Your OTP for prime-lane registration is ${otp}`;
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
