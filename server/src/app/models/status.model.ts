import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    file: {
      type: String
    },
    content: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Status", statusSchema);