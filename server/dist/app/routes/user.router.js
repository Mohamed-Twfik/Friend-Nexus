"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const user_permission_1 = require("../middlewares/user.permission");
const user_validator_1 = require("../middlewares/user.validator");
const router = express_1.default.Router();
router.get("/list", user_controller_1.getAllUsers);
router.get("/profile/:userId", (0, user_validator_1.userIdValidator)(), user_permission_1.getOneUserPermission, user_controller_1.getUser);
router.patch("/", (0, user_validator_1.updateUserValidator)(), user_controller_1.updateUser);
router.patch("/updatePassword", (0, user_validator_1.updatePasswordValidator)(), user_controller_1.updatePassword);
router.patch("/updateRole/:userId", (0, user_validator_1.userIdValidator)(), user_controller_1.updateRole);
router.patch("/updateEmail", (0, user_validator_1.requestUpdateEmailValidator)(), user_controller_1.requestUpdateEmail);
router.patch("/verifyNewEmail", (0, user_validator_1.verifyNewEmailValidator)(), user_controller_1.verifyNewEmail);
router.delete("/:userId", (0, user_validator_1.userIdValidator)(), user_permission_1.deleteUserPermission, user_controller_1.deleteUser);
exports.default = router;
