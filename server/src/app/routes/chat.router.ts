import express from "express";
import {
  addChatUser,
  createChat,
  deleteChat,
  getChatUsers,
  getOneChat,
  getUserChats,
  leaveChat,
  removeChatUser,
  updateChat,
  updateChatUserRole,
} from "../controllers/chat.controller";
import {
  checkChatAccess,
  checkChatAdmin,
  checkChatMember,
  checkChatModerator,
} from "../middlewares/auth/chat.permission";
import {
  chatIdValidator,
  createChatValidator,
  updateChatValidator,
  userIdAndChatIdValidator
} from "../middlewares/validators/chat.validator";
import uploadMW from "../middlewares/fileUpload";

const router = express.Router();

router.get("/list", getUserChats);
router.get("/:chatId", chatIdValidator(), checkChatMember("authUser"), getOneChat);
router.post("/new", uploadMW("image", "single", "logo"), createChatValidator(), createChat);
router.patch("/:chatId", uploadMW("image", "single", "logo"), updateChatValidator(), checkChatModerator, updateChat);
router.delete("/:chatId", chatIdValidator(), checkChatModerator, deleteChat);

router.get("/users/list/:chatId", chatIdValidator(), checkChatMember("authUser"), getChatUsers);
router.post("/users/add/:userId/:chatId", userIdAndChatIdValidator(), checkChatModerator, addChatUser);
router.post("/users/join/:chatId", chatIdValidator(), checkChatAccess, addChatUser);
router.patch("/users/role/:userId/:chatId", userIdAndChatIdValidator(), checkChatAdmin, checkChatMember("user"), updateChatUserRole);
router.delete("/users/remove/:userId/:chatId", userIdAndChatIdValidator(), checkChatModerator, checkChatMember("user"), removeChatUser);
router.delete("/users/leave/:chatId", chatIdValidator(), checkChatMember("authUser"), leaveChat);

export default router;