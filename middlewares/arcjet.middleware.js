import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
	try {
		const decision = await aj.protect(req, { requested: 1 });

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				return res.status(429).json({
					message: "Too many requests, please try again later.",
					statusCode: 429,
				});
			} else if (decision.reason.isBot()) {
				return res.status(403).json({
					message: "Bot traffic is not allowed.",
					statusCode: 403,
				});
			} else {
				return res.status(403).json({
					message: "Request denied.",
					statusCode: 403,
				});
			}
		}

		next();
	} catch (error) {
		console.error("Arcjet middleware error:", error);
		next(); // Allow request on error
	}
};

export { arcjetMiddleware };
