import { param } from "express-validator";
import tokenModel from "../models/token.model";

export const tokenIdValidator = () => {
  return [
    param("tokenId")
      .isMongoId()
      .withMessage("Invalid Token Id")
      .bail()
      .custom(async (value, { req }) => {
        const token = await tokenModel.findById(value);
        if (!token) throw new Error("Invalid Token Id");
        if (token.user.toString() !== req.user._id.toString()) throw new Error("Invalid Token Id");
        req.wantedToken = token;
      })
  ]
};