import { Router } from "express";
import {
	createSubscription,
	getAllSubscriptions,
	getSubscription,
} from "../controllers/subscription.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

// Routes
subscriptionRouter.get("/v1/subscriptions", getAllSubscriptions);

subscriptionRouter.get("/v1/subscriptions/:uuid", getSubscription);

subscriptionRouter.post(
	"/v1/subscriptions/create",
	authorize,
	createSubscription
);

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
