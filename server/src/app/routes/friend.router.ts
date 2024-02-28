import express from "express";

const router = express.Router();

router.get("/list");
router.get("/receive/list");
router.get("/send/list");
router.post("/send/:userId");
router.patch("/accept/:userId");
router.patch("/reject/:userId");
router.delete("/:userId");

export default router;