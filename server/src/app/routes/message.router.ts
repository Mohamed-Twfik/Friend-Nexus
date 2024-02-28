import express from "express";

const router = express.Router();

router.get("/list/:chatId");
router.post("/new");
router.patch("/:messageId");
router.delete("/:messageId");

export default router;