import express, { type NextFunction } from "express";
import { type Request, type Response } from "express";
import {
  sendMessage,
  createChatroom,
  editMessage,
} from "../controllers/messageController.ts";
import {
  logIn,
  signUp,
  logOut,
  validateUserForm,
  passport,
} from "../controllers/auth.ts";

const indexRouter = express.Router();

const setUser = (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user;
  next();
};

indexRouter.post(
  "/message",
  passport.authenticate("jwt", { session: false }),
  setUser,
  sendMessage,
);
indexRouter.patch(
  "/message",
  passport.authenticate("jwt", { session: false }),
  setUser,
  editMessage,
);
indexRouter.post("/chatroom", createChatroom);
indexRouter.post("/log-in", validateUserForm, logIn);
indexRouter.get("/log-out", logOut);
indexRouter.post("/sign-up", signUp);

export default indexRouter;
