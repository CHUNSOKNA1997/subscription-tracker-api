import { Router } from "express";

const authRouter = Router();

authRouter.get("/v1/auth/users", (req, res) => {
	res.json({ message: "This is a user API" });
});

authRouter.post("/v1/auth/signup", (req, res) => {
	res.json({
		message: "This is a signup API",
	});
});

authRouter.post("/v1/auth/signin", (req, res) => {
	res.json({
		message: "This is a signin API",
	});
});

authRouter.delete("/v1/auth/signout", (req, res) => {
	res.json({
		message: "This is a signout API",
	});
});

export default authRouter;
