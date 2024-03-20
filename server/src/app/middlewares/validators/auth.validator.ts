import bcrypt from "bcrypt";
import { body } from "express-validator";
import userModel from "../../models/user.model";
import {
  emailValidator,
  fnameValidator,
  lnameValidator,
  passwordValidator,
} from "./shared.validator";

const codeValidator = (key: string, message: string) => {
  return body("code")
    .trim()
    .isLength({ min: 8 }).withMessage(message)
    .custom(async (value, { req }) => {
      const user = req.user;
      if (!user[key]) throw new Error("Code Not Found");

      else if (user[key].code !== value) throw new Error(message);

      else if (new Date(user[key].expireAt).getTime() < new Date().getTime()) throw new Error("Code Expired");
    });
};

export const signinValidator = ()=>{
  return [
    emailValidator("Incorrect Email Or Password", {password: 1, verified: 1}),

    passwordValidator("Incorrect Email Or Password")
      .custom(async (value, { req }) => {
        const user = req.user;
        const match = await bcrypt.compare(value, user.password);
        if(!match) throw new Error("Incorrect Email Or Password");
      }),
  ]
};


export const signupValidator = ()=>{
  return [
    body("email")
      .trim()
      .isEmail().withMessage("Invalid Email")
      .normalizeEmail()
      .custom(async (value, {req}) => {
        const user = await userModel.findOne({email: value});
        if(user) throw new Error("Email already exists");
      }),

    passwordValidator("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

    fnameValidator(),

    lnameValidator(),
  ]
};


export const verifyEmailValidator = () => {
  return [
    emailValidator("Incorrect Email Or Code", {emailVerificationCode: 1}),

    codeValidator("emailVerificationCode", "Incorrect Email Or Code"),
  ]
};


export const resetPasswordValidator = ()=>{
  return [
    emailValidator("Email Not Found"),
  ]
}


export const newPasswordValidator = ()=>{
  return [
    emailValidator("Incorrect Email Or Code", { resetPasswordCode: 1 }),

    codeValidator("resetPasswordCode", "Incorrect Email Or Code"),

    passwordValidator("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  ]
}