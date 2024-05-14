"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const status_controller_1 = require("../controllers/status.controller");
const status_permission_1 = require("../middlewares/auth/status.permission");
const status_validator_1 = require("../middlewares/validators/status.validator");
const fileUpload_1 = __importDefault(require("../middlewares/fileUpload"));
const user_validator_1 = require("../middlewares/validators/user.validator");
const router = express_1.default.Router();
router.get("/me/list", (0, status_controller_1.getUserStatusList)("owner"));
router.get("/friend/list/:userId", (0, user_validator_1.userIdValidator)(), (0, status_controller_1.getUserStatusList)("friend"));
router.get("/:statusId", (0, status_validator_1.statusIdValidator)(), status_permission_1.getOneStatusPermission, status_controller_1.getOneStatus);
router.post("/new", (0, fileUpload_1.default)("media", "single", "file"), (0, status_validator_1.createStatusValidator)(), status_controller_1.createStatus);
router.delete("/:statusId", (0, status_validator_1.statusIdValidator)(), status_permission_1.deleteStatusPermission, status_controller_1.deleteStatus);
exports.default = router;
