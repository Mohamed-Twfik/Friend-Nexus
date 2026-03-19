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



router.get("/list", getAllUsers);
router.get("/profile/:userId", userIdValidator(), getOneUserPermission, getUser);

/**
 * @swagger
 * /users:
 *  patch:
 *    summary: Update User Data.
 *    tags: [User]
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:      # Request body contents
 *            $ref: "#/components/schemas/UpdateUserSchema"
 *        application/json:
 *          schema:      # Request body contents
 *            $ref: "#/components/schemas/UpdateUserSchema"
 *    responses:
 *      201:
 *        description: Code Send To Email Successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Please check your email for code"
 *              
 *      404:
 *        description: URL Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Not Found URL: ${URL} With Method: ${method}"
 *                status:
 *                  type: number
 *                  example: 422
 *                data:
 *                  type: object
 *                  description: Error Details
 * 
 *      422:
 *        description: Data is incorrect
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Invalid Data"
 *                status:
 *                  type: number
 *                  example: 422
 *                data:
 *                  type: object
 *                  description: Error Details
 * 
 *      500:
 *        description: Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Server Error"
 *                status:
 *                  type: number
 *                  example: 500
 *                data:
 *                  type: object
 *                  description: Error Details
 */
router.patch("/", uploadMW("image", "single", "logo"), updateUserValidator(), updateUser);

router.patch("/updatePassword", updatePasswordValidator(), updatePassword);
router.patch("/updateRole/:userId", userIdValidator(), updateRole);
router.patch("/updateEmail", requestUpdateEmailValidator(), requestUpdateEmail)
router.patch("/verifyNewEmail", verifyNewEmailValidator(), verifyNewEmail)

router.delete("/:userId", userIdValidator(), deleteUserPermission, deleteUser);

export default router;