import { body } from "express-validator";
import userModel from "../../models/user.model";
import bcrypt from "bcrypt";

export const signinValidator = ()=>{
  return [
    body("email")
      .trim()
      .isEmail().withMessage("Incorrect Email Or Password")
      .normalizeEmail()
      .custom(async (value, {req}) => {
        const user = await userModel.findOne({email: value});
        if(!user) throw new Error("Incorrect Email Or Password");
        req.user = user;
      }),

    body("password")
      .trim()
      .isLength({min: 8})
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage("Incorrect Email Or Password")
      .custom(async (value, {req})=>{
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

    body("password")
      .trim()
      .isLength({min: 8})
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

    body("fname")
      .trim()
      .isLength({min: 2}).withMessage("First Name must be at least 2 characters long")
      .escape(),

    body("lname")
      .trim()
      .isLength({min: 2}).withMessage("Last Name must be at least 2 characters long")
      .escape(),
  ]
};


export const verifyEmailValidator = ()=>{
  return [
    body("email")
      .trim()
      .isEmail().withMessage("Incorrect Email Or Code")
      .normalizeEmail()
      .custom(async (value, {req}) => {
        const user = await userModel.findOne({email: value});
        if(!user) throw new Error("Incorrect Email Or Code");
        req.user = user;
      }),
      
    body("code")
      .trim()
      .isLength({min: 8}).withMessage("Incorrect Email Or Code")
      .custom(async (value, {req})=>{
        const user = req.user;
        if (!user.emailVerificationCode) throw new Error("Email Already Verified");

        else if (user.emailVerificationCode.code !== value) throw new Error("Incorrect Email Or Code");

        else if (new Date(user.emailVerificationCode.expireAt).getTime() < new Date().getTime()) throw new Error("Code Expired");
      }),
  ]
};


export const resetPasswordValidator = ()=>{
  return [
    body("email")
      .trim()
      .isEmail().withMessage("Email Not Found")
      .normalizeEmail()
      .custom(async (value, {req})=>{
        const user = await userModel.findOne({email:value});
        if (!user) throw new Error("Email Not Found");
        req.user = user;
      })
  ]
}


export const newPasswordValidator = ()=>{
  return [
    body("email")
      .trim()
      .isEmail().withMessage("Incorrect Email Or Code")
      .normalizeEmail()
      .custom(async (value, {req}) => {
        const user = await userModel.findOne({email: value});
        if(!user) throw new Error("Incorrect Email Or Code");
        req.user = user;
      }),
      
    body("code")
      .trim()
      .isLength({min: 8}).withMessage("Incorrect Email Or Code")
      .custom(async (value, {req})=>{
        const user = req.user;
        if (!user.resetPasswordCode) throw new Error("Email Already Verified");

        else if (user.resetPasswordCode.code !== value) throw new Error("Incorrect Email Or Code");

        else if (user.resetPasswordCode.expireAt < new Date()) throw new Error("Code Expired");
      }),

    body("password")
      .trim()
      .isLength({min: 8}).withMessage("password must be at least 8 characters long")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage("password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
  ]
}