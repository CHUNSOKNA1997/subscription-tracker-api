import { Router } from "express";
import { getAllUsers, getUserByUuid } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/v1/users", getAllUsers);

userRouter.get("/v1/users/:uuid", getUserByUuid);

userRouter.post("/v1/users/create", (req, res) => {
	res.status(400).json({
		message:
			"This endpoint is not implemented. Please use the /api/v1/auth/signup endpoint to create a user.",
	});
});

userRouter.put("/v1/users/:id", (req, res) => {
	res.json({
		message: "This is an update user API",
	});
});

userRouter.delete("/v1/users/:id", (req, res) => {
	res.json({
		message: "This is a delete user API",
	});
});

export default userRouter;
