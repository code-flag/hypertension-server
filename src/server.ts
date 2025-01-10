import express from "express";
import { serverOptions } from "./config/options.js";
import app from "./app.js";
import debug from "debug";
import http from "http";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { NotFoundError } from "./helper/error.js";

const DEBUG = debug("dev");
const PORT: number | string = process.env.NODE_ENV === "test" ? 3800 : process.env.PORT || 3200;
const host: string = process.env.HOST || "http://localhost";

process.on("uncaughtException", (error) => {
  DEBUG(`uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  DEBUG(`unhandled rejection at ${promise} reason: ${reason}`);
  process.exit(1);
});

const server: any = createServer(app);
const io: any = new Server(server, {
  ...serverOptions,
});

/**
 * Handles all user socket events
 */
// const notification: any = io.of("/notification");
// const deal: any = io.of("/deal");

app.use(express.static("public"));


/** ================================== Invalid route response ================================ */

app.all("*", (request: any, response: any) => {
  throw new NotFoundError("Invalid route.");
});

server.listen(PORT, () => {
  DEBUG(
    `server running on  ${host}:${PORT} in ${process.env.NODE_ENV} mode.\npress CTRL-C to stop`
  );
});

