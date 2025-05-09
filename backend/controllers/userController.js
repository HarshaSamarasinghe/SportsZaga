import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { log } from "console";

const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    log("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    log("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// List users
const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.status(200).json({
      success: true,
      data: users,
      message: "User list fetched successfully",
    });
  } catch (error) {
    log("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove user
const removeUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    log("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get profile info
const profileInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    log("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User profile updated successfully" });
  } catch (error) {
    log("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  loginUser,
  registerUser,
  listUsers,
  removeUser,
  profileInfo,
  updateProfile,
};
