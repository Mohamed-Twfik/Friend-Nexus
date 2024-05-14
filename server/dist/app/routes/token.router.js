"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_controller_1 = require("../controllers/token.controller");
const token_permission_1 = require("../middlewares/auth/token.permission");
const token_validator_1 = require("../middlewares/validators/token.validator");
const router = express_1.default.Router();
router.get("/list", token_controller_1.getUserTokens);
router.get("/:tokenId", (0, token_validator_1.tokenIdValidator)(), token_permission_1.checkTokenOwner, token_controller_1.getOneToken);
router.delete("/:tokenId", (0, token_validator_1.tokenIdValidator)(), token_permission_1.checkTokenOwner, token_controller_1.deleteToken);
exports.default = router;
