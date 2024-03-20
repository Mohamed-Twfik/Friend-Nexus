"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const status_controller_1 = require("../controllers/status.controller");
const status_validator_1 = require("../middlewares/status.validator");
const status_permission_1 = require("../middlewares/status.permission");
const router = express_1.default.Router();
router.get("/me/list", status_controller_1.getUserStatusList);
router.get("/friends/list", status_controller_1.getFriendsStatusList);
router.get("/:statusId", (0, status_validator_1.statusIdValidator)(), status_permission_1.getOneStatusPermission, status_controller_1.getOneStatus);
router.post("/", (0, status_validator_1.createStatusValidator)(), status_controller_1.createStatus);
router.delete("/:statusId", (0, status_validator_1.statusIdValidator)(), status_permission_1.deleteStatusPermission, status_controller_1.deleteStatus);
exports.default = router;
