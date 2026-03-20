import express from "express";
import {
  acceptFriendRequest,
  deleteOrRejectFriend,
  getFriendList,
  getFriendReceiveList,
  getFriendSendList,
  sendFriendRequest
} from "../controllers/friendShip.controller";
import {
  friendShipValidator,
  sendFriendRequestValidator
} from "../middlewares/validators/friendShip.validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Friendship
 *   description: Friendship Routes.
 * 
 * components:
 *   schemas:
 *     Friendship:
 *       type: object
 *       properties:
 *         requester:
 *           type: string
 *           description: User ID
 *         recipient:
 *           type: string
 *           description: User ID
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 */

/**
 * @swagger
 * /friendShips/list:
 *  get:
 *    summary: Get friends list
 *    tags: [Friendship]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of friends retrieved successfully
 *      500:
 *        description: Server Error
 */
router.get("/list", getFriendList);

/**
 * @swagger
 * /friendShips/receive/list:
 *  get:
 *    summary: Get received friend requests
 *    tags: [Friendship]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Received requests retrieved successfully
 *      500:
 *        description: Server Error
 */
router.get("/receive/list", getFriendReceiveList);

/**
 * @swagger
 * /friendShips/send/list:
 *  get:
 *    summary: Get sent friend requests
 *    tags: [Friendship]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Sent requests retrieved successfully
 *      500:
 *        description: Server Error
 */
router.get("/send/list", getFriendSendList);

/**
 * @swagger
 * /friendShips/send/{userId}:
 *  post:
 *    summary: Send a friend request
 *    tags: [Friendship]
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
 *        description: Friend request sent
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */
router.post("/send/:userId", sendFriendRequestValidator(), sendFriendRequest);

/**
 * @swagger
 * /friendShips/accept/{userId}:
 *  patch:
 *    summary: Accept a friend request
 *    tags: [Friendship]
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
 *        description: Friend request accepted
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */
router.patch("/accept/:userId", friendShipValidator(), acceptFriendRequest);

/**
 * @swagger
 * /friendShips/deleteOrReject/{userId}:
 *  delete:
 *    summary: Delete a friend or reject a friend request
 *    tags: [Friendship]
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
 *        description: Friend or request deleted
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */
router.delete("/deleteOrReject/:userId", friendShipValidator(), deleteOrRejectFriend);

export default router;