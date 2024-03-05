import express from "express";
import { signin, signup, verifyEmail, resetPassword, newPassword, signout} from "../controllers/auth.controller";
import { signupValidator, signinValidator, newPasswordValidator, verifyEmailValidator, resetPasswordValidator } from "../middlewares/validators/auth.validator"
import authentication from "../middlewares/Auth/authentication";

const router = express.Router();

router.post("/signin", signinValidator(), signin);
router.post("/signup", signupValidator(), signup);
router.post("/code", verifyEmailValidator(), verifyEmail);
router.post("/resetPassword", resetPasswordValidator(), resetPassword);
router.post("/newPassword", newPasswordValidator(), newPassword);
router.post("/signout", authentication, signout);

export default router