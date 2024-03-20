import express from "express";
import {
  getChatMessages,
  createMessage,
  updateMessage,
  deleteMessage
} from "../controllers/message.controller";
import {
  messageIdValidator,
  createMessageValidator,
  updateMessageValidator
} from "../middlewares/message.validator";
import {
  checkMessageOwner,
  deleteMessagePermission,
  getAndAddChatMessagePermission
} from "../middlewares/message.permission";
import {
  chatIdValidator
} from "../middlewares/chat.validator";


const router = express.Router();

router.get("/list/:chatId", chatIdValidator(), getAndAddChatMessagePermission, getChatMessages);
router.post("/new/:chatId", createMessageValidator(), getAndAddChatMessagePermission, createMessage);
router.patch("/:messageId", updateMessageValidator(), checkMessageOwner, updateMessage);
router.delete("/:messageId", messageIdValidator(), deleteMessagePermission, deleteMessage);

export default router;