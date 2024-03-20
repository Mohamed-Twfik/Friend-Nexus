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

router.get("/list", getUserTokens);
router.get("/:tokenId", tokenIdValidator(), checkTokenOwner, getOneToken);

router.delete("/:tokenId", tokenIdValidator(), checkTokenOwner, deleteToken);

export default router;