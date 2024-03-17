import express from "express";
import {
  getUserTokens,
  getOneToken,
  deleteToken,
} from "../controllers/token.controller";
import {
  tokenIdValidator
} from "../middlewares/token.validator";

const router = express.Router();

router.get("/list", getUserTokens);
router.get("/:tokenId", tokenIdValidator(), getOneToken);

router.delete("/:tokenId", tokenIdValidator(), deleteToken);

export default router;