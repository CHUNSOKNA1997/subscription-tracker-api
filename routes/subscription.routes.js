import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/v1/subscriptions", (req, res) => {
	res.json({
		message: "This is a subscriptions API",
	});
});

subscriptionRouter.get("/v1/subscriptions/:id", (req, res) => {
	res.json({
		message: `This is a subscription detail API for ID: ${req.params.id}`,
	});
});

subscriptionRouter.post("/v1/subscriptions/create", (req, res) => {
	res.json({
		message: "This is a create subscription API",
	});
});

subscriptionRouter.get("/v1/subscriptions/user/:id", (req, res) => {
	res.json({
		message: `This is a get subscriptions by user ID API for User ID: ${req.params.userId}`,
	});
});

subscriptionRouter.put("/v1/subscriptions/:id/update", (req, res) => {
	res.json({
		message: `This is an update subscription API for ID: ${req.params.id}`,
	});
});

subscriptionRouter.delete("/v1/subscriptions/:id/delete", (req, res) => {
	res.json({
		message: `This is a delete subscription API for ID: ${req.params.id}`,
	});
});

subscriptionRouter.post("/v1/subscriptions/:id/cancel", (req, res) => {
	res.json({
		message: `This is a cancel subscription API for ID: ${req.params.id}`,
	});
});

subscriptionRouter.post("/v1/subscriptions/upcoming_renewal", (req, res) => {
	res.json({
		message: "This is an upcoming_renewal subscription API",
	});
});

export default subscriptionRouter;
