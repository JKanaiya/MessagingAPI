import express, { type NextFunction } from "express";
import passport from "passport";
import { Server } from "socket.io";
import { createServer } from "http";
import "dotenv/config.js";
import cors from "cors";
import indexRouter from "./routes/indexRouter.js";
import { editMessage, sendMessage } from "./controllers/messageController.js";

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
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://odinmessagingapp.netlify.app",
    ],
    credentials: true,
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
// Replace io.engine.use with io.use
// io.use((socket, next) => {
//   passport.authenticate("jwt", { session: false })(
//     socket.request,
//     socket.request.res || {},
//     (err: any, user: any) => {
//       if (err || !user) {
//         return next(new Error("Authentication error"));
//       }
//       // Attach user to the socket request for later use
//       socket.request.user = user;
//       next();
//     },
//   );
// });

io.on("connection", (socket) => {
  socket.on("message", async (message) => {
    const result = await sendMessage(
      message.text,
      message.chatroomId,
      socket.request.user,
    );
    io.emit("receive-message", result.mess);
  });
  socket.on("edit-message", (message) => {
    editMessage(message.text, socket.request.user, message.id);
  });

  socket.on("user-added", (user) => {
    socket.emit("new-user");
  });

  socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
    console.log(err.message);

    // some additional description, for example the status code of the initial HTTP response
    console.log(err.description);

    // some additional context, for example the XMLHttpRequest object
    console.log(err.context);
  });

  socket.on("join chat", (chat) => {
    socket.join(chat);
    socket.emit("joined chat", chat);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Express listening on PORT: ${PORT}`);
});
