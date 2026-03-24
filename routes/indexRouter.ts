import express from "express";
import { sendMessage } from "../controllers/messageController.ts"
import { logIn, signUp, logOut, validateUserForm, passport } from "../controllers/auth.ts";


const indexRouter = express.Router();

indexRouter.post("/message", passport.authenticate('jwt', { session: false }), sendMessage)
indexRouter.post("/log-in", validateUserForm, logIn);
indexRouter.get("/log-out", logOut);
indexRouter.post("/sign-up", validateUserForm, signUp);

export default indexRouter;

