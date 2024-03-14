import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
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
      default: "default-logo.jpg"
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

userSchema.pre(/^find/, async function (this: any, next) {
  this.select({ __v: 0, password: 0, changePasswordAt: 0, emailVerificationCode: 0, resetPasswordCode: 0 });
});

userSchema.post("deleteOne", async function (this: any, doc, next) {
  await this.model("Token").deleteMany({ user: doc._id });
  next();
});

export default mongoose.model("User", userSchema);