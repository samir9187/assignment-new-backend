import express from "express";
import Item from "../models/Item.models.js";
import { checkToken } from "../controllers/user.controllers.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const newItem = new Item({
      name,
      description,
      price,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// router.post("/:id/comments", async (req, res) => {
//   const { comment } = req.body;
//     const authHeader = req.headers.authorization;
//   // const user = req.user.username;
//   if (!user) {
//     res.status(401).json({ msg: "Not Authenticated" });
//   }
//   try {
//     const item = await Item.findById(req.params.id);
//     if (!item) {
//       return res.status(404).json({ msg: "Item not found" });
//     }
//     item.comments.push({ user, comment });
//     await item.save();
//     res.json(item);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });
router.post("/:id/comments", async (req, res) => {
  const { comment } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1]; // Extract token from header
  if (!token) {
    console.log("No token provided"); // Debugging
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = await checkToken(token); // Use the checkToken function
    // const username = decoded.us; // Assuming user ID is in the token
    const username = decoded.id; // Assuming user ID is in the token

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    item.comments.push({ user: username, comment });
    await item.save();
    res.json(item);
  } catch (err) {
    // if (err.name === "JsonWebTokenError") {
    //   return res.status(403).json({ msg: "Invalid token" });
    // }
    console.error("Server Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
    if (!token) return res.status(401).json({ msg: "No token provided" });

    // Verify token
    const decoded = await checkToken(token);
    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({ msg: "Unauthorized" }); // Check if the user is an admin
    }
    const itemId = req.params.id;
    const updateData = req.body;

    // Find the item by ID and update it
    const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, {
      new: true, // Return the updated item
      runValidators: true, // Validate the update
    });

    if (!updatedItem) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json({ msg: "Item deleted successfully", deletedItem });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
