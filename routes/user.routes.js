import { Router } from "express";
import {
	getUser,
	getUsers,
	createUser,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const userRouter = Router();

// Protected routes - require authentication
userRouter.get("/v1/users", authenticateToken, getUsers);

userRouter.get("/v1/users/:uuid", authenticateToken, getUser);

userRouter.post("/v1/users/create", authenticateToken, createUser);

userRouter.put("/v1/users/:id", authenticateToken, (req, res) => {
	res.json({
		message: "This is an update user API",
		user: req.user, // Access authenticated user
	});
});

userRouter.delete("/v1/users/:id", authenticateToken, (req, res) => {
	res.json({
		message: "This is a delete user API",
		user: req.user, // Access authenticated user
	});
});

export default userRouter;
