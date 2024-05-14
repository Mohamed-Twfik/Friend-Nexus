"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authentication_1 = __importDefault(require("../middlewares/auth/authentication"));
const auth_validator_1 = require("../middlewares/validators/auth.validator");
const router = express_1.default.Router();
router.post("/signin", (0, auth_validator_1.signinValidator)(), auth_controller_1.signin);
router.post("/signup", (0, auth_validator_1.signupValidator)(), auth_controller_1.signup);
router.post("/code", (0, auth_validator_1.verifyEmailValidator)(), auth_controller_1.verifyEmail);
router.post("/resetPassword", (0, auth_validator_1.resetPasswordValidator)(), auth_controller_1.resetPassword);
router.post("/newPassword", (0, auth_validator_1.newPasswordValidator)(), auth_controller_1.newPassword);
router.post("/signout", authentication_1.default, auth_controller_1.signout);
exports.default = router;
