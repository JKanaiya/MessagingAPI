import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import "dotenv/config.js";
import cors from "cors";
import indexRouter from "../routes/indexRouter.ts";
import { log } from "console";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/", indexRouter);

describe("Auth testing", () => {
  it("works with a user that already exists", async () => {
    const loginRes = await request(app)
      .post("/log-in")
      .send({
        email: "user1@fakemail.com",
        password: "fakepassword1"
      })
      .expect(200)

    expect(loginRes.body).toEqual(expect.objectContaining({ email: "user1@fakemail.com" }))
  })

  it("does not auth a user with an incorrect password", async () => {
    const getToken = await request(app)
      .post("/log-in")
      .send({
        email: "user1@fakemail.com",
        password: "fakerpassword"
      })
    const attemptAuth = await request(app)
      .post("/message")
      .send({
        messageId: 20,
        token: getToken.body.token,
        name: "user1",
        text: "Hi, this is a message",
        chatroomId: 12
      })
      .expect(401)

    expect(attemptAuth.text).toBe("Unauthorized")
  })
})

describe("Messages testing", () => {
  it("sends messages successfully", async () => {
    const loginRes = await request(app)
      .post("/log-in")
      .send({
        email: "user1@fakemail.com",
        password: "fakepassword1"
      })
      .expect(200)

    expect(loginRes.body).toEqual(expect.objectContaining({ email: "user1@fakemail.com" }))

    log(loginRes.body)

    const res = await request(app)
      .post("/message")
      .send({
        token: loginRes.body.token,
        messageId: 23,
        name: "user1",
        text: "Hi, this is a message",
        chatroomId: 12
      })
    // .expect(200)
    log(res)

    expect(res.body).toBe("Message was sent");
  })
})

