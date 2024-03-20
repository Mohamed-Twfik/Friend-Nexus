import express from "express";
import {
  newPassword,
  resetPassword,
  signin,
  signout,
  signup,
  verifyEmail
} from "../controllers/auth.controller";
import {
  newPasswordValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
  verifyEmailValidator
} from "../middlewares/auth.validator";
import authentication from "../middlewares/authentication";

const router = express.Router();

router.post("/signin", signinValidator(), signin);
router.post("/signup", signupValidator(), signup);
router.post("/code", verifyEmailValidator(), verifyEmail);
router.post("/resetPassword", resetPasswordValidator(), resetPassword);
router.post("/newPassword", newPasswordValidator(), newPassword);
router.post("/signout", authentication, signout);

export default router