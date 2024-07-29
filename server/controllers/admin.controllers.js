import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.models.js";

export const adminRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    res
      .status(201)
      .json({ msg: "Admin registered successfully", admin: savedAdmin });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ msg: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, id: admin._id });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const checkToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Token is invalid" });
      }
      res.json(decoded);
    });
  } catch (err) {
    console.error("Token Verification Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
