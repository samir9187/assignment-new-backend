import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  comments: [
    {
      user: { type: String, required: true },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Item", ItemSchema);
