import mongoose from "mongoose";

const schema = new mongoose.Schema({
  changePasswordAt:{
    type: Date
  }
});

export default mongoose.model("User", schema);