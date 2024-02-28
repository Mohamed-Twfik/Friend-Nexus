import express from "express";

const router = express.Router();

router.post("/signin");
router.post("/signup");
router.post("/code");

export default router