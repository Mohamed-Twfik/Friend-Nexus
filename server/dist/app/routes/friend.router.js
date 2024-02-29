"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/list");
router.get("/receive/list");
router.get("/send/list");
router.post("/send/:userId");
router.patch("/accept/:userId");
router.patch("/reject/:userId");
router.delete("/:userId");
exports.default = router;
