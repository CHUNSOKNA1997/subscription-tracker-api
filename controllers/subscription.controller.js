import prisma from "../prisma/prisma.js";
import subscriptionCollection from "../resources/subscription.collection.js";
import subscriptionResource from "../resources/subscription.resource.js";
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
 * Get a single subscription by UUID
 * @param {*} req
 * @param {*} res
 */
export const getSubscription = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		try {
			const subscription = await prisma.subscription.findUnique({
				where: { uuid: req.params.uuid },
			});

			if (!subscription) {
				return res.error({
					message: "Subscription not found",
				});
			}

			res.success({
				subscription: subscriptionResource(subscription),
			});
		} catch (error) {
			res.error({
				message: "Failed to fetch subscription",
				error: error.message,
			});
		}
	});
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
			subscription: subscriptionCollection(newSubscription),
		});
	} catch (error) {
		res.error({
			error: "Failed to create subscription",
			details: error.message,
		});
	}
};

/**
 * Get subscriptions for a specific user
 * @param {*} req
 * @param {*} res
 */
export const getUserSubscriptions = async (req, res) => {
	try {
		await prisma.$transaction(async (prisma) => {
			const subscriptions = await prisma.subscription.findMany({
				where: { userId: parseInt(req.params.id, 10) },
			});

			if (!subscriptions || subscriptions.length === 0) {
				return res.error({
					message: "No subscriptions found for this user",
				});
			}

			res.success({
				subscriptions: subscriptionCollection(subscriptions),
			});
		});
	} catch (error) {
		res.error({
			message: "Failed to fetch user subscriptions",
			error: error.message,
		});
	}
};
