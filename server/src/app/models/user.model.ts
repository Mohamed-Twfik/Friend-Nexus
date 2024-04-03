import mongoose, { Document, Query } from "mongoose";
import bcrypt from "bcrypt";
import { IUserSchema } from "../types/user.type";
import tokenModel from "./token.model";
import statusModel from "./status.model";
import messageModel from "./message.model";
import friendShipModel from "./friendShip.model";
import chatUserModel from "./chatUser.model";
import chatModel from "./chat.model";

const userSchema = new mongoose.Schema<IUserSchema>({
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user"
    },
    logo: {
      type: String,
    },
    changePasswordAt: {
      type: Date,
      default: new Date()
    },
    emailVerificationCode: {
      code: {
        type: String,
      },
      expireAt: {
        type: Date,
      }
    },
    resetPasswordCode: {
      code: {
        type: String,
      },
      expireAt: {
        type: Date,
      }
    },
    newEmail: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true });

userSchema.pre("save", async function (next) {
  try{
    if (this.isModified("password")) {
      this.password = bcrypt.hashSync(this.password, 8);
      this.changePasswordAt = new Date();
      await this.model("Token").deleteMany({ user: this._id });
    }
    next();
  } catch(err) {
    next(err as Error);
  }
});

userSchema.pre(/^find/, async function (this: Query<Document, IUserSchema>, next) {
  this.select({ __v: 0, password: 0, changePasswordAt: 0, emailVerificationCode: 0, resetPasswordCode: 0, newEmail: 0, verified: 0 });
});

userSchema.post('findOneAndDelete', async function (doc) {
  await tokenModel.deleteMany({ user: doc._id });
  const friendShips = await friendShipModel.find({
    $or: [
      { user1: doc._id },
      { user2: doc._id }
    ]
  });
  for (const friendShip of friendShips) {
    await friendShipModel.findOneAndDelete({ _id: friendShip._id });
  }
  await statusModel.deleteMany({ user: doc._id });
  await messageModel.updateMany({ user: doc._id }, { user: null });
  await chatUserModel.deleteMany({ user: doc._id, userRole: {$ne: "admin"}});
  const chats = await chatModel.find({ admin: doc._id });
  for (const chat of chats) {
    const firstMember = await chatUserModel.findOne({ chat: chat._id });
    // if (!firstMember) await chat.deleteOne();
    if (!firstMember) await chatModel.findOneAndDelete({ _id: chat._id });
    else {
      chat.admin = firstMember._id
      firstMember.userRole = "admin";
      await chat.save();
      await firstMember.save();
      await chatUserModel.deleteOne({ user: doc._id, chat: chat._id });
    }
  }
});

export default mongoose.model<IUserSchema>("User", userSchema);



// 0910
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGRkMzNkN2YxYTk3M2FlNWE0Mjk5NyIsImlhdCI6MTcxMjE4MjEyNSwiZXhwIjoxNzEyMTg1NzI1fQ.kPA3hv5nYEJjcjZcdejEEdPf9QnqGDZTCJLxK4Q7jUA

// 910
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGRkMzQxN2YxYTk3M2FlNWE0Mjk5YiIsImlhdCI6MTcxMjE4MjE3MCwiZXhwIjoxNzEyMTg1NzcwfQ.khM0LfP5_cD4U9WCfJIsYgge6Trpg2yz1thU7PVdXOM