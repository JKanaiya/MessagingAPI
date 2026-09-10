import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import "dotenv/config.js";
import cors from "cors";
import indexRouter from "../routes/indexRouter.ts";

const app = express();

app.use(express.json());
app.use(cors());
app.use(indexRouter);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

describe("Auth testing", () => {
  it("works with a user that already exists", async () => {
    const loginRes = await request(app)
      .post("/log-in")
      .send({
        email: "user@fakemail.com",
        password: "fakepassword1",
      })
      .expect(200);

    expect(loginRes.body).toEqual(
      expect.objectContaining({ email: "user@fakemail.com" }),
    );
  });

  it("does not auth a user with an incorrect password", async () => {
    const getToken = await request(app).post("/log-in").send({
      email: "user@fakemail.com",
      password: "fakerpassword",
    });
    const attemptAuth = await request(app)
      .post("/message")
      .send({
        token: getToken.body.token,
        name: "user",
        text: "Hi, this is a message",
        chatroomId: 12,
      })
      .expect(401);

    expect(attemptAuth.text).toBe("Unauthorized");
  });
});

describe("Messages testing", () => {
  let token: string;
  let messageId: number;
  it("sends messages successfully", async () => {
    const loginRes = await request(app)
      .post("/log-in")
      .send({
        email: "user@fakemail.com",
        password: "fakepassword1",
      })
      .expect(200);

    expect(loginRes.body).toEqual(
      expect.objectContaining({ email: "user@fakemail.com" }),
    );

    token = loginRes.body.token;

    const res = await request(app)
      .post("/message")
      .set(`Authorization`, `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        name: "user",
        text: "Hi, this is a message",
        chatroomId: 12,
      })
      .expect(200);

    expect(res.body.mess).toBe("Message was sent");
    messageId = res.body.messId;
  });

  it("edits a message successfully", async () => {
    const res = await request(app)
      .patch("/message")
      .set(`Authorization`, `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        name: "user",
        text: "Hi, this is a new message",
        chatroomId: 12,
        timeSent: new Date().toISOString(),
        messageId: messageId,
      })
      .expect(200);

    expect(res.body.messUpdated).toBe(true);
  });

  it("does not allow editing if the message was sent > 30 mins ago", async () => {
    const now = new Date();
    let nowPlus30 = new Date(now.getTime() + 31 * 60 * 1000).toISOString();
    await request(app)
      .patch("/message")
      .set(`Authorization`, `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        name: "user",
        text: "Hi, this is a new message",
        chatroomId: 12,
        timeSent: nowPlus30,
        messageId: messageId,
      })
      .expect(400);
  });
});
