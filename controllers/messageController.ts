import { type Request, type Response } from "express";
import passport from "passport";
import { prisma } from "./prisma.ts";
import { log } from "console";

const sendMessage = async (req: Request, res: Response) => {
  const { text, chatroomId } = req.body;

  const now = new Date();

  try {
    const message = await prisma.message.create({
      data: {
        userId: req.user.id,
        timeSent: now.toISOString(),
        chatroomId: Number(chatroomId),
        text,
      },
    });
    res.status(200).json({ mess: "Message was sent", messId: message.id });
  } catch (e) {
    console.log("error" + e);
    res.status(400).json(e);
  }
};

const editMessage = async (req: Request, res: Response) => {
  const { text, chatroomId, messageId, timeSent } = req.body;

  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      userId: req.user.id,
      chatroomId: chatroomId,
    },
  });

  const oldDate = new Date(message.timeSent);
  const newDate = new Date(timeSent);

  const diff = Math.abs(newDate - oldDate) / 60 / 1000;

  if (diff <= 30) {
    try {
      await prisma.message.update({
        where: {
          id: messageId,
          userId: req.user.id,
          chatroomId: chatroomId,
        },
        data: {
          text: text,
          timeUpdated: new Date().toISOString(),
        },
      });
      res.status(200).json({ messUpdated: true });
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  } else {
    res.status(400).json("Message is too old to be updated.");
  }
};

const createChatroom = [
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const chatroom = await prisma.chatroom.create({
        data: {
          userId: req.user?.id,
        },
      });
      res
        .status(200)
        .json({ chat: "Chatroom was created", messId: chatroom.id });
    } catch (e) {
      log(e);
      res.status(400).json(e);
    }
  },
];

export { sendMessage, createChatroom, editMessage };
