import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

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
