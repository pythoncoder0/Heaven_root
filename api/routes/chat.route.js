import express from "express";
import { getChatWithUser } from "../controllers/chat.controller.js";

import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);
router.get("/with/:receiverId", verifyToken, getChatWithUser); // Get chat with specific user

export default router;
