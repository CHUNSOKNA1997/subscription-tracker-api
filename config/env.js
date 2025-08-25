import { config } from "dotenv";

config({ path: `.env` });

export const { PORT, NODE_ENV, DATABASE_URL } = process.env;
