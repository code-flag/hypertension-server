import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const generateAuthToken = ({id, type}: any) =>{
  // console.log({id, type});
  return jwt.sign({ id, type}, process.env.JWT_SECRET ?? '', {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
export default generateAuthToken;
