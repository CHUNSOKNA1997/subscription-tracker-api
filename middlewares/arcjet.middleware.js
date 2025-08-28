import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
	try {
		const decision = await aj.protect(req, { requested: 1 });

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				return res.error({
					message: "Rate limit exceeded. Please try again later.",
				});
			} else if (decision.reason.isBot()) {
				return res.error({
					message: "Bot activity detected. Access denied.",
				});
			} else {
				return res.error({
					message: "Access denied.",
				});
			}
		}

		next();
	} catch (error) {
		next(error);
	}
};

export { arcjetMiddleware };
