const subscriptionResource = (subscription) => {
	return {
		id: subscription.id,
		userId: subscription.userId,
		name: subscription.name,
		price: subscription.price,
		currency: subscription.currency,
		frequency: subscription.frequency,
		category: subscription.category,
		paymentMethod: subscription.paymentMethod,
		status: subscription.status,
		startDate: subscription.startDate,
		renewalDate: subscription.renewalDate,
	};
};

export default subscriptionResource;
