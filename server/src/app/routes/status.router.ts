import express from "express";
import {
  getUserStatusList,
  getFriendsStatusList,
  getOneStatus,
  createStatus,
  deleteStatus,
} from "../controllers/status.controller";
import {
  statusIdValidator,
  createStatusValidator
} from "../middlewares/status.validator";
import {
  getOneStatusPermission,
  deleteStatusPermission
} from "../middlewares/status.permission";

const router = express.Router();

router.get("/me/list", getUserStatusList);
router.get("/friends/list", getFriendsStatusList);
router.get("/:statusId", statusIdValidator(), getOneStatusPermission, getOneStatus);

router.post("/", createStatusValidator(), createStatus);

router.delete("/:statusId", statusIdValidator(), deleteStatusPermission, deleteStatus);

export default router;