import express from "express";
import {
  getUserTokens,
  getOneToken,
  deleteToken,
} from "../controllers/token.controller";
import {
  tokenIdValidator
} from "../middlewares/token.validator";
import {
  checkTokenOwner
} from "../middlewares/token.permission";

const router = express.Router();

router.get("/list", getUserTokens);
router.get("/:tokenId", tokenIdValidator(), checkTokenOwner, getOneToken);

router.delete("/:tokenId", tokenIdValidator(), checkTokenOwner, deleteToken);

export default router;