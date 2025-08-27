import { Router } from "express";
import {
	getUser,
	getUsers,
	createUser,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const userRouter = Router();

// Apply authentication to all routes in this router
userRouter.use(authenticateToken);

// All routes below are now protected
userRouter.get("/v1/users", getUsers);
userRouter.get("/v1/users/:uuid", getUser);
userRouter.post("/v1/users/create", createUser);

userRouter.put("/v1/users/:id", (req, res) => {
	res.json({
		message: "This is an update user API",
		user: req.user,
	});
});

userRouter.delete("/v1/users/:id", (req, res) => {
	res.json({
		message: "This is a delete user API",
		user: req.user,
	});
});

export default userRouter;
