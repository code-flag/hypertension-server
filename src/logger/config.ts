import { config } from "dotenv";
config();

export default {
    env: process.env.NODE_ENV,
    host: process.env.PORT,
    meta: "Transaction:server",
    version: "1.0.0"
}


// Default log meta
export const LOG_META = "Transaction:server"