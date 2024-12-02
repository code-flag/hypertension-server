import crypto from "crypto";

export const generateRandomPassword = (length: number) => {
  const result = crypto.randomBytes(length).toString("hex");
  return result;
};

