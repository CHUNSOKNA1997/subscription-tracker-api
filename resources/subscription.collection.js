import subscriptionResource from "./subscription.resource.js";

const subscriptionCollection = (subscriptions) => {
	return subscriptions.map((subscription) =>
		subscriptionResource(subscription)
	);
};

export default subscriptionCollection;
