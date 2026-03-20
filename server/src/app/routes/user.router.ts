import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  requestUpdateEmail,
  updatePassword,
  updateRole,
  updateUser,
  verifyNewEmail,
} from "../controllers/user.controller";
import {
  deleteUserPermission,
  getOneUserPermission
} from "../middlewares/auth/user.permission";
import {
  requestUpdateEmailValidator,
  updatePasswordValidator,
  updateUserValidator,
  userIdValidator,
  verifyNewEmailValidator
} from "../middlewares/validators/user.validator";
import uploadMW from "../middlewares/fileUpload";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Routes.
 * 
 * components:
 *   schemas:
 *     UpdateUserSchema:
 *       type: object
 *       properties:
 *         fname: 
 *           type: string
 *         lname: 
 *           type: string
 *         logo:
 *           type: file
 */



/**
 * @swagger
 * /users/list:
 *  get:
 *    summary: Get a list of all users
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of users retrieved successfully
 *      500:
 *        description: Server Error
 */
router.get("/list", getAllUsers);

/**
 * @swagger
 * /users/profile/{userId}:
 *  get:
 *    summary: Get a user profile by ID
 *    tags: [User]
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
 *        description: User profile retrieved successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Server Error
 */
router.get("/profile/:userId", userIdValidator(), getOneUserPermission, getUser);

/**
 * @swagger
 * /users:
 *  patch:
 *    summary: Update user details
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: "#/components/schemas/UpdateUserSchema"
 *    responses:
 *      200:
 *        description: User updated successfully
 *      422:
 *        description: Code sent to email
 *      404:
 *        description: API Not Found
 *      500:
 *        description: Server Error
 */
router.patch("/", uploadMW("image", "single", "logo"), updateUserValidator(), updateUser);

/**
 * @swagger
 * /users/updatePassword:
 *  patch:
 *    summary: Update user password
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              oldPassword:
 *                type: string
 *              newPassword:
 *                type: string
 *    responses:
 *      200:
 *        description: Password updated successfully
 *      400:
 *        description: Bad request or incorrect old password
 *      500:
 *        description: Server Error
 */
router.patch("/updatePassword", updatePasswordValidator(), updatePassword);

/**
 * @swagger
 * /users/updateRole/{userId}:
 *  patch:
 *    summary: Update a user's role (Admin)
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
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
 *                enum: [user, admin]
 *    responses:
 *      200:
 *        description: Role updated successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.patch("/updateRole/:userId", userIdValidator(), updateRole);

/**
 * @swagger
 * /users/updateEmail:
 *  patch:
 *    summary: Request to update user email
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Verification email sent
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */
router.patch("/updateEmail", requestUpdateEmailValidator(), requestUpdateEmail);

/**
 * @swagger
 * /users/verifyNewEmail:
 *  patch:
 *    summary: Verify and confirm new user email
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              code:
 *                type: string
 *    responses:
 *      200:
 *        description: Email updated successfully
 *      400:
 *        description: Bad request or invalid code
 *      500:
 *        description: Server Error
 */
router.patch("/verifyNewEmail", verifyNewEmailValidator(), verifyNewEmail);

/**
 * @swagger
 * /users/{userId}:
 *  delete:
 *    summary: Delete a user
 *    tags: [User]
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
 *        description: User deleted successfully
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error
 */
router.delete("/:userId", userIdValidator(), deleteUserPermission, deleteUser);

export default router;