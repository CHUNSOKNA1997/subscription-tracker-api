import { config } from "dotenv";

config({ path: `.env` });

export const {
	PORT,
	NODE_ENV,
	DATABASE_URL,
	JWT_SECRET,
	JWT_EXPIRES_IN,
	ARCJET_KEY,
	ARCJET_ENV,
} = process.env;
