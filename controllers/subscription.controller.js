import prisma from "../prisma/prisma.js";

const calculateRenewalDate = (startDate, frequency) => {
	const date = new Date(startDate);

	switch (frequency) {
		case "DAILY":
			date.setDate(date.getDate() + 1);
			break;
		case "WEEKLY":
			date.setDate(date.getDate() + 7);
			break;
		case "MONTHLY":
			date.setMonth(date.getMonth() + 1);
			break;
		case "QUARTERLY":
			date.setMonth(date.getMonth() + 3);
			break;
		case "YEARLY":
			date.setFullYear(date.getFullYear() + 1);
			break;
		default:
			throw new Error("Invalid frequency");
	}

	return date;
};

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
				userId: req.user.id, // Assuming user info comes from auth middleware
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
