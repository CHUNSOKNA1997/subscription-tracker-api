import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import prisma from "../prisma/prisma.js";

/**
 * Middleware to verify JWT token and authenticate user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.error({
			message: "unauthenticated",
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		// Verify user still exists in database
		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: {
				id: true,
				uuid: true,
				email: true,
				name: true,
			},
		});

		if (!user) {
			return res.error({
				message: "User not found",
			});
		}

		// Attach user to request object
		req.user = user;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.error({
				message: "Token expired",
				statusCode: 401,
			});
		} else if (error.name === "JsonWebTokenError") {
			return res.error({
				message: "Invalid token",
				statusCode: 401,
			});
		} else {
			return res.error({
				message: "Token verification failed",
				statusCode: 401,
			});
		}
	}
};
