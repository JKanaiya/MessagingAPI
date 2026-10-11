import express, { type NextFunction } from "express";
import multer from "multer";
import { type Request, type Response } from "express";
import {
  sendMessage,
  createChatroom,
  editMessage,
  getChatrooms,
  setProfileImg,
  getUsers,
  updateUserName,
} from "../controllers/messageController.js";
import {
  logIn,
  signUp,
  logOut,
  validateUserForm,
  passport,
} from "../controllers/auth.js";

import { handleUpload } from "../controllers/uploadController.js";

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
indexRouter.post("/profile-image", setProfileImg);
indexRouter.get(
  "/auth-check",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    res.status(200).json("authed");
  },
);
indexRouter.get("/log-out", logOut);
indexRouter.get("/users", getUsers);
indexRouter.post("/chatroom", createChatroom);
indexRouter.post("/log-in", validateUserForm, logIn);
indexRouter.post("/sign-up", signUp);
indexRouter.post(
  "/profile-image",
  passport.authenticate("jwt", { session: false }),
  upload.single("uploaded_file"),
  handleUpload,
);
indexRouter.patch("/name", updateUserName);

export default indexRouter;
