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
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try{
    if (this.isModified("password")) {
      this.password = bcrypt.hashSync(this.password, 8);
      this.changePasswordAt = new Date();
      await this.model("token").deleteMany({ user: this._id });
    }
    next();
  } catch(err) {
    next(err as Error);
  }
});

// userSchema.pre(/^find/, async function () {
//   this.select({ __v: 0, code: 0, changePasswordAt: 0});
// });

export default mongoose.model("User", userSchema);