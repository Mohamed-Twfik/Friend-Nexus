import tokenModel from "../models/token.model";
import { mongoIdValidator } from "./shared.validator";

export const tokenIdValidator = () => {
  return [
    mongoIdValidator("token", tokenModel)
  ]
};