import express from "express";
import {
  chatIdValidator,
  createChatValidator,
  updateChatValidator,
  userIdAndChatIdValidator
} from "../middlewares/chat.validator";
import {
  checkChatMember,
  checkChatModerator,
  checkChatAdmin,
  checkChatAccess
} from "../middlewares/chat.permission";
import {
  getUserChats,
  getOneChat,
  createChat,
  updateChat,
  deleteChat,
  getChatUsers,
  addChatUser,
  updateChatUserRole,
  removeChatUser,
  leaveChat,
} from "../controllers/chat.controller";

const router = express.Router();

router.get("/list", getUserChats);
router.get("/:chatId", chatIdValidator(), checkChatMember("authUser"), getOneChat);
router.post("/new", createChatValidator(), createChat);
router.patch("/:chatId", updateChatValidator(), checkChatModerator, updateChat);
router.delete("/:chatId", chatIdValidator(), checkChatModerator, deleteChat);

router.get("/users/list/:chatId", chatIdValidator(), checkChatMember("authUser"), getChatUsers);
router.post("/users/add/:userId/:chatId", userIdAndChatIdValidator(), checkChatModerator, addChatUser);
router.post("/users/join/:chatId", chatIdValidator(), checkChatAccess, addChatUser);
router.patch("/users/role/:userId/:chatId", userIdAndChatIdValidator(), checkChatAdmin, checkChatMember("user"), updateChatUserRole);
router.delete("/users/remove/:userId/:chatId", userIdAndChatIdValidator(), checkChatModerator, checkChatMember("user"), removeChatUser);
router.delete("/users/leave/:chatId", chatIdValidator(), checkChatMember("authUser"), leaveChat);

// router.get("/messages/list/:chatId", chatIdValidator(), checkChatMember("authUser"), );

export default router;