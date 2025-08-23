import { Router } from "express";

const authRouter = Router();

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

authRouter.post("/v1/auth/signout", (req, res) => {
	res.json({
		message: "This is a signout API",
	});
});

export default authRouter;
