
import { beforeAll, afterAll } from "vitest";
import "dotenv/config";
import supertest, { type SuperTest, Test } from "supertest";
import { prisma } from "../controllers/prisma.ts";

let request: SuperTest<Test>;

beforeAll(async () => {
  await prisma.user.create({
    data: {
      name: "user1",
      email: "user1@fakemail.com",
      password: "fakepassword1"
    }
  })
  await prisma.user.create({
    data: {
      name: "user2",
      email: "user2@fakemail.com",
      password: "fakepassword2"
    }
  })
  await prisma.chatroom.create({
    data: {
      id: 15
    }
  })
});

afterAll(async () => {
  // NOTE: the date in the test setup needs to be deleted in the inverted sequence of its creation
  await prisma.user.deleteMany({});
  await prisma.chatroom.deleteMany({});
});


export { request };
