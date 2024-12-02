
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

// Hash password to ensure it security
export const encryptPassword = async (password: string): Promise<string> => {
	const saltRounds: any = await bcrypt.genSalt(
		Number(process.env.SALT_ROUNDS ?? 10)
	  );
	return await bcrypt.hash(password, saltRounds);
};

// Verify password by comparing with hashed password
export const verifyPassword = async (
	password: string,
	hash: string
): Promise<Boolean> => {
	return await bcrypt.compare(password, hash);
};
