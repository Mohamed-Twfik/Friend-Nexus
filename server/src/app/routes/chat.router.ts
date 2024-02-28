import express from "express";

const router = express.Router();

router.get("/list");
router.get("/:chatId");
router.post("/new");
router.patch("/:chatId");
router.delete("/:chatId");

router.get("/users/list/:chatId");
router.post("/users/add");
router.patch("/users/role/:userId/:chatId");
router.delete("/users/remove/:userId/:chatId");
router.delete("/users/leave/:chatId");

router.get("/messages/list/:chatId");

export default router;