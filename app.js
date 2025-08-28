import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import { responseMiddleware } from "./middlewares/response.middleware.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";

const app = express();
app.use(express.json());
app.use(responseMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(arcjetMiddleware);

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", subscriptionRouter);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
