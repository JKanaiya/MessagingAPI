import express from "express";
import { sendMessage } from "../controllers/messageController.ts"

const indexRouter = express.Router();

indexRouter.post("message", sendMessage)

export default indexRouter;

