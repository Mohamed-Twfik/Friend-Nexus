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
 *     User:
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
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example:   # Sample object
 *              email: test@test.com
 *              password: test33
 *    responses:
 *      200:
 *        description: Login success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Login Success"
 *                data: 
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                    token:
 *                      type: string
 *                  example:
 *                    userId: "660dd3417f1a973ae5a4299b"
 *                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGRkMzQxN2YxYTk3M2FlNWE0Mjk5YiIsImlhdCI6MTcxMzQxNjM4MywiZXhwIjoxNzEzNDE5OTgzfQ.4KQeejoZ92Nbk4_ktDF55qIm4zfu9HT3mbGzrGgQ0FQ"
 *              
 *      401:
 *        description: Email is not verified or number of devices that allowed is exceed
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Email Not Verified"
 *                status:
 *                  type: number
 *                  example: 401
 *                data:
 *                  type: object
 *                  description: Error Details
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
 *          schema:      # Request body contents
 *            $ref: "#/components/schemas/User"
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
router.post("/signup", signupValidator(), signup);

/**
 * @swagger
 * /auth/code:
 *  post:
 *    summary: Verify email Operation.
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              code:
 *                type: string
 *            example:   # Sample object
 *              email: test@test.com
 *              code: 123456
 *    responses:
 *      202:
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
router.post("/code", verifyEmailValidator(), verifyEmail);

/**
 * @swagger
 * /auth/resetPassword:
 *  post:
 *    summary: request to reset password.
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *            example:   # Sample object
 *              email: test@test.com
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
router.post("/resetPassword", resetPasswordValidator(), resetPassword);

/**
 * @swagger
 * /auth/newPassword:
 *  post:
 *    summary: Reset Password Operation.
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:      # Request body contents
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              code:
 *                type: string
 *              password:
 *                type: string
 *            example:   # Sample object
 *              email: test@test.com
 *              code: 123456
 *              password: test@212
 *    responses:
 *      202:
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
router.post("/newPassword", newPasswordValidator(), newPassword);


router.post("/signout", authentication, signout);

export default router