import express, { type NextFunction } from "express";
import passport from "passport";
import { Server } from "socket.io";
import { createServer } from "http";
import "dotenv/config.js";
import cors from "cors";
import indexRouter from "./routes/indexRouter.js";
import { editMessage, sendMessage } from "./controllers/messageController.ts";

const app = express();
app.use(express.json());
app.use(cors());
app.use(indexRouter);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.engine.use((req: Request, res: Request, next: NextFunction) => {
  const isHandshake = req._query.sid === undefined;
  if (isHandshake) {
    passport.authenticate("jwt", { session: false })(req, res, next);
  } else {
    next();
  }
});

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    sendMessage(message.text, 88888888, socket.request.user);
  });
  socket.on("edit-message", (message) => {
    editMessage(message.text, socket.request.user, message.id);
  });
});

const PORT = process.env.HOST || 3000;
httpServer.listen(PORT, () => {
  `Express listening on PORT: ${PORT}`;
});
