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

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat Routes.
 * 
 * components:
 *   schemas:
 *     CreateChat:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         chatType:
 *           type: string
 *           enum: [private, group]
 *         chatPrivacy:
 *           type: string
 *           enum: [public, private]
 *         logo:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /chats/list:
 *  get:
 *    summary: Get all chats for the authenticated user
 *    tags: [Chat]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of user chats
 *      500:
 *        description: Server Error
 */
router.get("/list", getUserChats);

/**
 * @swagger
 * /chats/{chatId}:
 *  get:
 *    summary: Get a specific chat by ID
 *    tags: [Chat]
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
 *        description: Chat details
 *      404:
 *        description: Chat not found
 *      500:
 *        description: Server Error
 */
router.get("/:chatId", chatIdValidator(), checkChatMember("authUser"), getOneChat);

/**
 * @swagger
 * /chats/new:
 *  post:
 *    summary: Create a new chat
 *    tags: [Chat]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/CreateChat'
 *    responses:
 *      201:
 *        description: Chat created successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */
router.post("/new", uploadMW("image", "single", "logo"), createChatValidator(), createChat);

/**
 * @swagger
 * /chats/{chatId}:
 *  patch:
 *    summary: Update a chat
 *    tags: [Chat]
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
 *            $ref: '#/components/schemas/CreateChat'
 *    responses:
 *      200:
 *        description: Chat updated successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.patch("/:chatId", uploadMW("image", "single", "logo"), updateChatValidator(), checkChatModerator, updateChat);

/**
 * @swagger
 * /chats/{chatId}:
 *  delete:
 *    summary: Delete a chat
 *    tags: [Chat]
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
 *        description: Chat deleted successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.delete("/:chatId", chatIdValidator(), checkChatModerator, deleteChat);

/**
 * @swagger
 * /chats/users/list/{chatId}:
 *  get:
 *    summary: Get list of users in a chat
 *    tags: [Chat]
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
 *        description: List of chat users
 *      500:
 *        description: Server Error
 */
router.get("/users/list/:chatId", chatIdValidator(), checkChatMember("authUser"), getChatUsers);

/**
 * @swagger
 * /chats/users/add/{userId}/{chatId}:
 *  post:
 *    summary: Add a user to a chat
 *    tags: [Chat]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: chatId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: User added successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.post("/users/add/:userId/:chatId", userIdAndChatIdValidator(), checkChatModerator, addChatUser);

/**
 * @swagger
 * /chats/users/join/{chatId}:
 *  post:
 *    summary: Join a public chat
 *    tags: [Chat]
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
 *        description: Joined successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.post("/users/join/:chatId", chatIdValidator(), checkChatAccess, addChatUser);

/**
 * @swagger
 * /chats/users/role/{userId}/{chatId}:
 *  patch:
 *    summary: Update a user's role in a chat
 *    tags: [Chat]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: chatId
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              role:
 *                type: string
 *                enum: [member, admin, moderator]
 *    responses:
 *      200:
 *        description: User role updated
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.patch("/users/role/:userId/:chatId", userIdAndChatIdValidator(), checkChatAdmin, checkChatMember("user"), updateChatUserRole);

/**
 * @swagger
 * /chats/users/remove/{userId}/{chatId}:
 *  delete:
 *    summary: Remove a user from a chat
 *    tags: [Chat]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: chatId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: User removed
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.delete("/users/remove/:userId/:chatId", userIdAndChatIdValidator(), checkChatModerator, checkChatMember("user"), removeChatUser);

/**
 * @swagger
 * /chats/users/leave/{chatId}:
 *  delete:
 *    summary: Leave a chat
 *    tags: [Chat]
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
 *        description: Left chat successfully
 *      500:
 *        description: Server Error
 */
router.delete("/users/leave/:chatId", chatIdValidator(), checkChatMember("authUser"), leaveChat);

export default router;