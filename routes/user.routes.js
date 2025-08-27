import { Router } from "express";
import {
	getUser,
	getUsers,
	createUser,
	deleteUser,
	updateUser,
	changePassword,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const userRouter = Router();

// Apply authentication to all routes in this router
userRouter.use(authenticateToken);

// User routes
userRouter.get("/v1/users", getUsers);

userRouter.get("/v1/users/:uuid", getUser);

userRouter.post("/v1/users/create", createUser);

userRouter.put("/v1/users/:uuid/update", updateUser);

userRouter.delete("/v1/users/:uuid/delete", deleteUser);

userRouter.post("/v1/users/:uuid/password/change", changePassword);

export default userRouter;
