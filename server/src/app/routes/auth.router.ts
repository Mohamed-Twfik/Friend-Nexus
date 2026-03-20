import express from "express";
import {
  newPassword,
  resetPassword,
  signin,
  signout,
  signup,
  verifyEmail
} from "../controllers/auth.controller";
import authentication from "../middlewares/auth/authentication";
import {
  newPasswordValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
  verifyEmailValidator
} from "../middlewares/validators/auth.validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication Routes.
 * 
 * components:
 *   schemas:
 *     UserCredentials:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password: 
 *           type: string
 *     UserSignup:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password: 
 *           type: string
 *         fname: 
 *           type: string
 *         lname: 
 *           type: string
 *     UserVerification:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         code:
 *           type: string
 *     ResetPassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *     NewPassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         code:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /auth/signin:
 *  post:
 *    summary: Sign In Operation.
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserCredentials'
 *    responses:
 *      200:
 *        description: Login successful
 *      401:
 *        description: Unauthorized or Unverified
 *      404:
 *        description: API Not Found
 *      422:
 *        description: Validation Error
 *      500:
 *        description: Server Error
 */
router.post("/signin", signinValidator(), signin);

/**
 * @swagger
 * /auth/signup:
 *  post:
 *    summary: Sign Up Operation.
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserSignup'
 *    responses:
 *      201:
 *        description: Code sent to email
 *      404:
 *        description: API Not Found
 *      422:
 *        description: Validation Error
 *      500:
 *        description: Server Error
 */
router.post("/signup", signupValidator(), signup);

/**
 * @swagger
 * /auth/code:
 *  post:
 *    summary: Verify email operation
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserVerification'
 *    responses:
 *      202:
 *        description: Verification successful
 *      404:
 *        description: API Not Found
 *      422:
 *        description: Validation Error
 *      500:
 *        description: Server Error
 */
router.post("/code", verifyEmailValidator(), verifyEmail);

/**
 * @swagger
 * /auth/resetPassword:
 *  post:
 *    summary: Request password reset email
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ResetPassword'
 *    responses:
 *      201:
 *        description: Code sent to email
 *      404:
 *        description: API Not Found
 *      422:
 *        description: Validation Error
 *      500:
 *        description: Server Error
 */
router.post("/resetPassword", resetPasswordValidator(), resetPassword);

/**
 * @swagger
 * /auth/newPassword:
 *  post:
 *    summary: Reset password with code
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewPassword'
 *    responses:
 *      202:
 *        description: Password reset successful
 *      404:
 *        description: API Not Found
 *      422:
 *        description: Validation Error
 *      500:
 *        description: Server Error
 */
router.post("/newPassword", newPasswordValidator(), newPassword);

/**
 * @swagger
 * /auth/signout:
 *  post:
 *    summary: Sign Out Operation
 *    tags: [Auth]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Logout successful
 *      401:
 *        description: Unauthorized
 */
router.post("/signout", authentication, signout);

export default router;