import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  requestUpdateEmail,
  updatePassword,
  updateRole,
  updateUser,
  verifyNewEmail,
} from "../controllers/user.controller";
import {
  deleteUserPermission,
  getOneUserPermission
} from "../middlewares/auth/user.permission";
import {
  requestUpdateEmailValidator,
  updatePasswordValidator,
  updateUserValidator,
  userIdValidator,
  verifyNewEmailValidator
} from "../middlewares/validators/user.validator";
import uploadMW from "../middlewares/fileUpload";

const router = express.Router();

router.get("/list", getAllUsers);
router.get("/profile/:userId", userIdValidator(), getOneUserPermission, getUser);

router.patch("/", uploadMW("image", "single", "logo"), updateUserValidator(), updateUser);
router.patch("/updatePassword", updatePasswordValidator(), updatePassword);
router.patch("/updateRole/:userId", userIdValidator(), updateRole);
router.patch("/updateEmail", requestUpdateEmailValidator(), requestUpdateEmail)
router.patch("/verifyNewEmail", verifyNewEmailValidator(), verifyNewEmail)

router.delete("/:userId", userIdValidator(), deleteUserPermission, deleteUser);

export default router;