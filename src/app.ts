import express, { Request, Response } from "express";
import cors from "cors";
import dotEnv from "dotenv";

import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler";
import router from "./routes/index.routes";
import { DBConnection } from "./config/database";
// import { returnMsg } from "./helper/message-handler";

dotEnv.config();
const app: any = express();
app.use(express.json({ limit: "50mb" }));


/**  ================================== Database connection ==================================  */

DBConnection();

/**  ================================== Cron Job ==================================  */



/** ===================================== Middleware ===================================== */
// header preflight configuration to prevent cors error
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
  })
);
// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** ============================= Helmet for securing api request headers =================== */
app.use(helmet());
if (
  ["development", "production"].includes(process.env.NODE_ENV || "development")
) {
  app.use(morgan("dev"));
}
// make folders visible
// app.use(express.static(path.join(__dirname,'public')));

/** ======================================= API ROUTES =======================================*/
app.use(router);

app.get("/", (request: any, response: any) => {
  response.status(200).json({
    status: "success",
    message: "Welcome to PSI project",
    data: {
      service: "PSI project",
      version: "2.0.0",
    },
  });
});

/** =============================== Upload Files or documents route =============================== */



/** ================================= General Errror Handling middleware ======================= */

app.use(errorHandler);

export default app;
