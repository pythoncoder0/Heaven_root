import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";

// REGISTER WITH OTP (handles duplicate/unverified users)
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists by email
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "Email already registered." });
      } else {
        // User exists but not verified, update OTP and resend
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
          where: { email },
          data: { otp, otpExpiry },
        });

        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: "OTP resent to email. Please verify." });
      }
    }

    // Check for duplicate username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpiry,
      },
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "User created. OTP sent to email." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

// Helper function to send OTP email
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Heaven Root OTP Code",
    text: `Your OTP is ${otp}`,
  });
}

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpiry: null },
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// RESEND OTP
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry },
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP resent to email." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
};

// LOGIN (only for verified users)
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email first." });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};