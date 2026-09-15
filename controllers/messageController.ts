import { type Request, type Response } from "express";
import passport from "passport";
import { prisma } from "./prisma.ts";
import { log } from "console";

type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  profileImageUrl: string | null;
};

// const sendMessage = async (req: Request, res: Response) => {
//   const { text, chatroomId } = req.body;
//
//   const now = new Date();
//
//   try {
//     const message = await prisma.message.create({
//       data: {
//         userId: req.user.id,
//         timeSent: now.toISOString(),
//         chatroomId: Number(chatroomId),
//         text,
//       },
//     });
//     res.status(200).json({ mess: "Message was sent", messId: message.id });
//   } catch (e) {
//     console.log("error" + e);
//     res.status(400).json(e);
//   }
// };

const sendMessage = async (text: string, chatroomId: number, user: User) => {
  const now = new Date();
  let chatroom;

  try {
    chatroom = await prisma.chatroom.findFirst({
      where: {
        id: chatroomId,
      },
    });
  } catch (e) {
    console.log(e);
  }

  if (user) {
    if (!chatroom) {
      chatroom = await prisma.chatroom.create({
        data: {
          userId: Number(user?.id),
        },
      });
    }
    try {
      const message = await prisma.message.create({
        data: {
          userId: Number(user.id),
          timeSent: now.toISOString(),
          chatroomId: Number(chatroom.id) || chatroomId,
          text,
        },
      });
      return { mess: "Message was sent", messId: message.id };
    } catch (e) {
      console.log("error" + e);
      return { err: "Message was not sent" };
    }
  }
};

// const editMessage = async (req: Request, res: Response) => {
//   const { text, chatroomId, messageId, timeSent } = req.body;
//
//   const message = await prisma.message.findFirst({
//     where: {
//       id: messageId,
//       userId: req.user.id,
//       chatroomId: chatroomId,
//     },
//   });
//
//   const oldDate = new Date(message.timeSent);
//   const newDate = new Date(timeSent);
//
//   const diff = Math.abs(newDate - oldDate) / 60 / 1000;
//
//   if (diff <= 30) {
//     try {
//       await prisma.message.update({
//         where: {
//           id: messageId,
//           userId: req.user.id,
//           chatroomId: chatroomId,
//         },
//         data: {
//           text: text,
//           timeUpdated: new Date().toISOString(),
//         },
//       });
//       res.status(200).json({ messUpdated: true });
//     } catch (e) {
//       console.log(e);
//       res.status(400).json(e);
//     }
//   } else {
//     res.status(400).json("Message is too old to be updated.");
//   }
// };

const editMessage = async (text: string, user: User, id: number) => {
  const message = await prisma.message.findFirst({
    where: {
      id: id,
      userId: Number(user.id),
    },
  });

  if (message) {
    const oldDate = new Date(message.timeSent);
    const now = new Date();

    const diff = Math.abs(now - oldDate) / 60 / 1000;

    if (diff <= 30) {
      try {
        await prisma.message.update({
          where: {
            id: id,
            userId: Number(user.id),
          },
          data: {
            text: text,
            timeUpdated: new Date().toISOString(),
          },
        });
        // res.status(200).json({ messUpdated: true });
        return { messUpdated: true };
      } catch (e) {
        console.log(e);
        return { messUpdated: false };
        res.status(400).json(e);
      }
    } else {
      // res.status(400).json({ mess: "Message is too old to be updated.", messUpdated: false });
      return { mess: "Message is too old to be updated.", messUpdated: false };
    }
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

const getChatrooms = [
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const chatrooms = await prisma.chatroom.findMany({
        include: {
          messages: {
            where: {
              userId: req.user?.id,
            },
          },
        },
      });
      console.log(chatrooms);
      res.status(200).json(chatrooms);
    } catch (e) {
      log(e);
      res.status(400).json(e);
    }
  },
];

export { sendMessage, createChatroom, editMessage, getChatrooms };
