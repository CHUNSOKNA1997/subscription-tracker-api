import { Router } from "express";

const userRouter = Router();

userRouter.get("/v1/users", (req, res) => {
	res.json({
		message: "This is a users API",
	});
});

userRouter.get("/v1/users/:id", (req, res) => {
	res.json({
		message: "This is a get user specification API",
	});
});

userRouter.post("/v1/users/create", (req, res) => {
	res.json({
		message: "This is a create user API",
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
