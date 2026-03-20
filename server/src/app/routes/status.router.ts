import express from "express";
import {
  createStatus,
  deleteStatus,
  getOneStatus,
  getUserStatusList,
} from "../controllers/status.controller";
import {
  deleteStatusPermission,
  getOneStatusPermission
} from "../middlewares/auth/status.permission";
import {
  createStatusValidator,
  statusIdValidator
} from "../middlewares/validators/status.validator";
import uploadMW from "../middlewares/fileUpload";
import { userIdValidator } from "../middlewares/validators/user.validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Status Routes.
 * 
 * components:
 *   schemas:
 *     CreateStatus:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *         backgroundColor:
 *           type: string
 *         file:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /statuses/me/list:
 *  get:
 *    summary: Get logged-in user's statuses
 *    tags: [Status]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: User statuses retrieved
 *      500:
 *        description: Server Error
 */
router.get("/me/list", getUserStatusList("owner"));

/**
 * @swagger
 * /statuses/friend/list/{userId}:
 *  get:
 *    summary: Get a friend's statuses
 *    tags: [Status]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Friend's statuses retrieved
 *      500:
 *        description: Server Error
 */
router.get("/friend/list/:userId", userIdValidator(), getUserStatusList("friend"));

/**
 * @swagger
 * /statuses/{statusId}:
 *  get:
 *    summary: Get a specific status by ID
 *    tags: [Status]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: statusId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Status retrieved
 *      404:
 *        description: Status not found
 *      500:
 *        description: Server Error
 */
router.get("/:statusId", statusIdValidator(), getOneStatusPermission, getOneStatus);

/**
 * @swagger
 * /statuses/new:
 *  post:
 *    summary: Create a new status
 *    tags: [Status]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/CreateStatus'
 *    responses:
 *      201:
 *        description: Status created
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */
router.post("/new", uploadMW("media", "single", "file"), createStatusValidator(), createStatus);

/**
 * @swagger
 * /statuses/{statusId}:
 *  delete:
 *    summary: Delete a status
 *    tags: [Status]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: statusId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Status deleted
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.delete("/:statusId", statusIdValidator(), deleteStatusPermission, deleteStatus);

export default router;