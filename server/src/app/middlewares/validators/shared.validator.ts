import { body, param } from "express-validator";
import userModel from "../../models/user.model";

export const emailValidator = (message: string, select: string | string[] | Record<string, number | boolean | object> = {}) => {
  return body("email")
    .trim()
    .isEmail().withMessage(message)
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await userModel.findOne({ email: value }).select(select);
      if (!user) throw new Error(message);
      req.user = user;
    });
};

export const passwordValidator = (message: string, keyName: string = "password") => {
  return body(keyName)
    .trim()
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/).withMessage(message);
};

export const fnameValidator = () => { 
  return body("fname")
    .trim()
    .isString()
    .isLength({ min: 2 }).withMessage("First Name must be a string with at least 2 characters long")
    .escape();
};

export const lnameValidator = () => { 
  return body("lname")
    .trim()
    .isString()
    .isLength({ min: 2 }).withMessage("Last Name must be a string with at least 2 characters long")
    .escape();
};

export const mongoIdValidator = (key: string, model: any) => {
  return param(`${key}Id`)
    .isMongoId()
    .withMessage("Invalid Id")
    .bail()
    .custom(async (value, { req }) => {
      const document = await model.findById(value);
      if (!document) throw new Error("Invalid Id");
      req[key] = document;
    });
};