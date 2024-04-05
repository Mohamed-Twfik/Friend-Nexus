import express from "express";
import {
  createStatus,
  deleteStatus,
  getOneStatus,
  getUserStatusList,
} from "../controllers/status.controller";
import {
  deleteStatusPermission,
  getOneStatusPermission
} from "../middlewares/auth/status.permission";
import {
  createStatusValidator,
  statusIdValidator
} from "../middlewares/validators/status.validator";
import uploadMW from "../middlewares/fileUpload";
import { userIdValidator } from "../middlewares/validators/user.validator";

const router = express.Router();

router.get("/me/list", getUserStatusList("owner"));
router.get("/friend/list/:userId", userIdValidator(), getUserStatusList("friend"));
router.get("/:statusId", statusIdValidator(), getOneStatusPermission, getOneStatus);

router.post("/", uploadMW("media", "single", "file"), createStatusValidator(), createStatus);

router.delete("/:statusId", statusIdValidator(), deleteStatusPermission, deleteStatus);

export default router;