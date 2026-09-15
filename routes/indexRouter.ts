import express, { type NextFunction } from "express";
import multer from "multer";
import { type Request, type Response } from "express";
import {
  sendMessage,
  createChatroom,
  editMessage,
  getChatrooms,
} from "../controllers/messageController.ts";
import {
  logIn,
  signUp,
  logOut,
  validateUserForm,
  passport,
} from "../controllers/auth.ts";

import { handleUpload } from "../controllers/uploadController.ts";

const indexRouter = express.Router();

const setUser = (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user;
  next();
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// indexRouter.post(
//   "/message",
//   passport.authenticate("jwt", { session: false }),
//   setUser,
//   sendMessage,
// );
// indexRouter.patch(
//   "/message",
//   passport.authenticate("jwt", { session: false }),
//   setUser,
//   editMessage,
// );
indexRouter.get("/chatrooms", getChatrooms);
indexRouter.get("/log-out", logOut);
indexRouter.post("/chatroom", createChatroom);
indexRouter.post("/log-in", validateUserForm, logIn);
indexRouter.post("/sign-up", signUp);
indexRouter.post(
  "/profile-image",
  passport.authenticate("jwt", { session: false }),
  upload.single("uploaded_file"),
  handleUpload,
);

export default indexRouter;
