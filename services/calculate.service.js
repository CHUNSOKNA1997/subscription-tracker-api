/**
 * Calculate the renewal date based on the start date and frequency
 * @param {*} startDate
 * @param {*} frequency
 * @returns
 */
export const calculateRenewalDate = (startDate, frequency) => {
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
