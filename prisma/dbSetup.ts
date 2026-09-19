import bcrypt from "bcryptjs";
import { prisma } from "../controllers/prisma.ts";

// TODO: Profile image url functionality
const users = [
  {
    email: "bla1@fakemail.com",
    name: "bla1",
    password: "bla!password",
  },
  {
    email: "bla2@fakemail.com",
    name: "bla2",
    password: "bla@password",
  },
  {
    email: "bla3#@fakemail.com",
    name: "bla3",
    password: "bla#password",
  },
];

const chat1messages = [
  "Hi, how are you",
  "How am i? how are you?",
  "Now listen here, buddy, one of us has to answer this question first, and it ain't gonna be me",
  "Wise guy, huh?",
  "Thems fighting words?",
  "You betcha",
];

const chat2messages = [
  "Hi, how are you",
  "How am i? how are you?",
  "This again? Do none of you know manners?",
  "Wise guy, huh?",
  "Why I oughta...",
  "Thems fighting words?",
  "Thats my line, punk.",
];

async function main() {
  users.map(
    async (user) =>
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          password: await bcrypt.hash(user.password, 10),
        },
      }),
  );

  const user1 = await prisma.user.findFirst({
    where: {
      email: users[0].email,
    },
  });

  const user2 = await prisma.user.findFirst({
    where: {
      email: users[1].email,
    },
  });

  const user3 = await prisma.user.findFirst({
    where: {
      email: users[2].email,
    },
  });

  console.log(user1, user2, user3);

  const chatroom1 = await prisma.chatroom.create({
    data: {
      userId: user1.id,
    },
  });

  const chatroom2 = await prisma.chatroom.create({
    data: {
      userId: user1.id,
    },
  });

  const now = new Date();

  for (let i = 0; i < chat1messages.length; i++) {
    await prisma.message.create({
      data: {
        chatroomId: chatroom1.id,
        text: chat1messages[i],
        timeSent: now.toISOString(),
        userId: i % 2 == 0 || i == 0 ? user1.id : user2.id,
      },
    });
  }

  for (let i = 0; i < chat2messages.length; i++) {
    await prisma.message.create({
      data: {
        chatroomId: chatroom2.id,
        text: chat2messages[i],
        timeSent: now.toISOString(),
        userId: i % 2 == 0 || i == 0 ? user1.id : user3.id,
      },
    });
  }
}

main()
  .then(async () => {
    // await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e);
    // await prisma.$disconnect()
    // process.exit(1)
  });
