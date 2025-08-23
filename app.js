import express from "express";
import { PORT } from "./config/env.js";

const app = express();

console.log(PORT);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
