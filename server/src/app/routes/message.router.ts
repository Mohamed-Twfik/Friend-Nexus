import express from "express";
import {
  createMessage,
  deleteMessage,
  getChatMessages,
  updateMessage
} from "../controllers/message.controller";
import {
  checkMessageOwner,
  deleteMessagePermission,
  getAndAddChatMessagePermission
} from "../middlewares/auth/message.permission";
import {
  chatIdValidator
} from "../middlewares/validators/chat.validator";
import {
  createMessageValidator,
  messageIdValidator,
  updateMessageValidator
} from "../middlewares/validators/message.validator";
import uploadMW from "../middlewares/fileUpload";


const router = express.Router();

router.get("/list/:chatId", chatIdValidator(), getAndAddChatMessagePermission, getChatMessages);
router.post("/new/:chatId", uploadMW("media", "array", "files"), createMessageValidator(), getAndAddChatMessagePermission, createMessage);
router.patch("/:messageId", uploadMW("media", "array", "files"), updateMessageValidator(), checkMessageOwner, updateMessage);
router.delete("/:messageId", messageIdValidator(), deleteMessagePermission, deleteMessage);

export default router;