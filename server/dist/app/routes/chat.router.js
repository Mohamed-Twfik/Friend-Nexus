"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/list");
router.get("/:chatId");
router.post("/new");
router.patch("/:chatId");
router.delete("/:chatId");
router.get("/users/list/:chatId");
router.post("/users/add");
router.patch("/users/role/:userId/:chatId");
router.delete("/users/remove/:userId/:chatId");
router.delete("/users/leave/:chatId");
router.get("/messages/list/:chatId");
exports.default = router;
