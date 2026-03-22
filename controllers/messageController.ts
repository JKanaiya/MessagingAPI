import { type Request, type Response } from "express";
import { prisma } from "./prisma.ts";

const sendMessage = async (req: Request, res: Response) => {
  const { text, chatroomId } = req.body;

  const now = new Date;

  try {
    await prisma.message.create({
      data: {
        userId: res.locals.user.id,
        timeSent: now.toLocaleDateString(),
        chatroomId,
        text
      }
    })
    res.status(200).json("Message was sent")
  } catch (e) {
    res.status(400).json("Message could not be sent")
  }
}

export {
  sendMessage
}
