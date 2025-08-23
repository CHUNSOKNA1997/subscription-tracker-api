import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

app.use("/api", authRouter);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
