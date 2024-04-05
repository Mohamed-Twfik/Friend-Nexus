import express from "express";
import {
  createStatus,
  deleteStatus,
  getFriendsStatusList,
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

const router = express.Router();

router.get("/me/list", getUserStatusList);
router.get("/friends/list", getFriendsStatusList);
router.get("/:statusId", statusIdValidator(), getOneStatusPermission, getOneStatus);

router.post("/", uploadMW("media", "single", "file"), createStatusValidator(), createStatus);

router.delete("/:statusId", statusIdValidator(), deleteStatusPermission, deleteStatus);

export default router;