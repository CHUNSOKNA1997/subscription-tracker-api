import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/v1/subscriptions", (req, res) => {
	res.json({
		message: "This is a subscriptions API",
	});
});

export default subscriptionRouter;
