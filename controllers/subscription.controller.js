import prisma from "../prisma/prisma.js";
import subscriptionCollection from "../resources/subscription.collection.js";
import { calculateRenewalDate } from "../services/calculate.service.js";

/**
 * Get all subscriptions
 * @param {*} req
 * @param {*} res
 */
export const getAllSubscriptions = async (req, res) => {
	try {
		const subscriptions = await prisma.subscription.findMany();

		res.success({
			subscriptions: subscriptionCollection(subscriptions),
		});
	} catch (error) {
		res.error({
			message: "Failed to fetch subscriptions",
			error: error.message,
		});
	}
};

/**
 * Create a new subscription
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const createSubscription = async (req, res) => {
	try {
		const {
			name,
			price,
			currency,
			frequency,
			category,
			paymentMethod,
			startDate,
			status,
		} = req.body;

		// Validate required fields
		if (!name || !price || !frequency || !category || !paymentMethod) {
			return res.error({
				error: "Missing required fields",
			});
		}

		// Parse and validate startDate
		const start = startDate ? new Date(startDate) : new Date();

		// Check if startDate is in the future
		if (start > new Date()) {
			return res.error({
				error: "Start date cannot be in the future",
			});
		}

		// Calculate renewal date based on frequency
		const renewalDate = calculateRenewalDate(start, frequency);

		const newSubscription = await prisma.subscription.create({
			data: {
				name,
				price,
				currency: currency || "USD",
				frequency,
				category,
				paymentMethod,
				status: status || "ACTIVE",
				startDate: start,
				renewalDate,
				userId: req.user.id,
			},
		});

		res.success({
			message: "Subscription created successfully",
			subscription: newSubscription,
		});
	} catch (error) {
		res.error({
			error: "Failed to create subscription",
			details: error.message,
		});
	}
};
