import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import "dotenv/config.js";
import cors from "cors";
import indexRouter from "./routes/indexRouter.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());
app.use(indexRouter);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("a user connected");
});

const PORT = process.env.HOST || 3000;
httpServer.listen(PORT, () => {
  `Express listening on PORT: ${PORT}`;
});
