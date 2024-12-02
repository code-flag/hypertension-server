export interface logger {
    timestamp: Date,
    environment: string,
    host: string,
    version: string
    // user provide the information below
    type: String,
    severity: string,
    message: string | null,
    data: any | null
}

export enum logTypes {
   SYSTEM = "system",
   THREAT = "threat",
   TRAFFIC = "traffic",
   CONFIG = "config",
}

export enum logSeverity {
   EMERGENCY = "emergency",
   ALERT = "alert",
   CRITICAL = "critical",
   ERROR = "error",
   WARNING = "warning",
   NOTICE = "notice",
   INFO = "info",
   DEBUG = "debug",
   TRACE = "trace",
}

export enum logLevel {
    EMERGENCY = 0,
   ALERT = 1,
   CRITICAL = 2,
   ERROR = 3,
   WARNING = 4,
   NOTICE = 5,
   INFO = 6,
   DEBUG = 7,
   TRACE =8,
}