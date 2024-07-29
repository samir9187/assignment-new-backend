import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.models.js"; // Adjust the import path as necessary

// User Registration
export const userRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ msg: "User registered successfully", user: savedUser });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: false },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, id: user._id });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Check Token
export const checkToken = (token) => {
  //   const token = req.headers.authorization?.split(" ")[1];
  //   if (!token) return res.status(401).json({ msg: "No token provided" });

  //   try {
  //     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //       if (err) {
  //         return res.status(401).json({ msg: "Token is invalid" });
  //       }
  //       res.json(decoded);
  //     });
  //   } catch (err) {
  //     console.error("Token Verification Error:", err);
  //     res.status(500).json({ msg: "Server error" });
  //   }
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};
