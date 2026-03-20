import express from "express";
import {
  deleteToken,
  getOneToken,
  getUserTokens,
} from "../controllers/token.controller";
import {
  checkTokenOwner
} from "../middlewares/auth/token.permission";
import {
  tokenIdValidator
} from "../middlewares/validators/token.validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Token
 *   description: Token Routes.
 */

/**
 * @swagger
 * /tokens/list:
 *  get:
 *    summary: Get list of user's active tokens/sessions
 *    tags: [Token]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Tokens retrieved successfully
 *      500:
 *        description: Server Error
 */
router.get("/list", getUserTokens);

/**
 * @swagger
 * /tokens/{tokenId}:
 *  get:
 *    summary: Get a specific token
 *    tags: [Token]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: tokenId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Token retrieved
 *      404:
 *        description: Token not found
 *      500:
 *        description: Server Error
 */
router.get("/:tokenId", tokenIdValidator(), checkTokenOwner, getOneToken);

/**
 * @swagger
 * /tokens/{tokenId}:
 *  delete:
 *    summary: Delete a token (logout from a session)
 *    tags: [Token]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: tokenId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Token deleted
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.delete("/:tokenId", tokenIdValidator(), checkTokenOwner, deleteToken);

export default router;