import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();
import User from "../models/user.js";
import { error } from "console";

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    //   checking for user with email
    const existingUser = await User.findOne({ email });

    // checking if user exist or registered
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    const result = {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      phone: existingUser.phone,
      email: existingUser.email,
      _id: existingUser._id,
    };
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// user registration endpoint

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, phone, confirmPassword } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already existing" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const hashPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      firstName, // Update this field
      lastName, // Update this field
      email,
      password: hashPassword,
      confirmPassword,
      phone,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // const transporter = nodemailer.createTransport({
    //   service: "gmail", // Replace with the email service you are using
    //   auth: {
    //     user: process.env.EMAIL_USER, // Your email address
    //     pass: process.env.EMAIL_PASS, // Your email password or app password
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: "attahikechukwu@gmail.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
             http://localhost:3000/reset-password/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p><p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p> <a href="http://localhost:3000/reset-password/${token}">http://localhost:3000/reset-password/${token}</a><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`, // html body
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("error", err);
        return res.status(500).json({ message: "Error sending email." });
      }
      res.status(200).json({ message: "Email sent successfully" });
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Add resetPassword controller function

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPassword: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expires" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPassword = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
