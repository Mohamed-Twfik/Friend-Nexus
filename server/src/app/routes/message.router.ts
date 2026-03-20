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

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message Routes.
 * 
 * components:
 *   schemas:
 *     CreateMessage:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *         files:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 */

/**
 * @swagger
 * /messages/list/{chatId}:
 *  get:
 *    summary: Get messages for a chat
 *    tags: [Message]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: chatId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Messages retrieved successfully
 *      500:
 *        description: Server Error
 */
router.get("/list/:chatId", chatIdValidator(), getAndAddChatMessagePermission, getChatMessages);

/**
 * @swagger
 * /messages/new/{chatId}:
 *  post:
 *    summary: Create a new message in a chat
 *    tags: [Message]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: chatId
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/CreateMessage'
 *    responses:
 *      201:
 *        description: Message created successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */
router.post("/new/:chatId", uploadMW("media", "array", "files"), createMessageValidator(), getAndAddChatMessagePermission, createMessage);

/**
 * @swagger
 * /messages/{messageId}:
 *  patch:
 *    summary: Update a message
 *    tags: [Message]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: messageId
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/CreateMessage'
 *    responses:
 *      200:
 *        description: Message updated successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.patch("/:messageId", uploadMW("media", "array", "files"), updateMessageValidator(), checkMessageOwner, updateMessage);

/**
 * @swagger
 * /messages/{messageId}:
 *  delete:
 *    summary: Delete a message
 *    tags: [Message]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: messageId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Message deleted successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.delete("/:messageId", messageIdValidator(), deleteMessagePermission, deleteMessage);

export default router;