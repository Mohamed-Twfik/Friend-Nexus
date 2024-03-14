import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updatePassword,
  verifyNewEmail,
  requestUpdateEmail,
  updateRole,
  updateUser,
} from "../controllers/user.controller";
import {
  deleteUserPermission,
  getOneUserPermission
} from "../middlewares/user.permission";
import {
  updatePasswordValidator,
  updateUserValidator,
  requestUpdateEmailValidator,
  verifyNewEmailValidator,
  validUserId
} from "../middlewares/user.validator";

const router = express.Router();

router.get("/list", getAllUsers);
router.get("/profile/:userId", validUserId(), getOneUserPermission, getUser);

router.patch("/", updateUserValidator(), updateUser);
router.patch("/updatePassword", updatePasswordValidator(), updatePassword);
router.patch("/updateRole/:userId", validUserId(), updateRole);
router.patch("/updateEmail", requestUpdateEmailValidator(), requestUpdateEmail)
router.patch("/verifyNewEmail", verifyNewEmailValidator(), verifyNewEmail)

router.delete("/:userId", validUserId(), deleteUserPermission, deleteUser);

export default router;