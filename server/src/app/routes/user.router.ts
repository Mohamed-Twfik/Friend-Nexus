import express from "express";

const router = express.Router();

router.get("/list");
router.get("/:userId");
router.post("/new");
router.patch("/:userId");
router.delete("/:userId");

export default router;