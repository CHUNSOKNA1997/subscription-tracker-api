import prisma from "../prisma/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

/**
 * Sign up a new user
 * @param {*} req
 * @param {*} res
 */
export const signUp = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		const { email, password, confirmation_password, name } = req.body;

		if (password != confirmation_password) {
			res.error({
				message: "Password and confirmation password do not match",
			});
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.error({
				message: "A user with this email already exists",
				error: "Conflict",
			});
		}

		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
		});

		const token = jwt.sign(
			{
				id: newUser.id,
				email: newUser.email,
			},
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES_IN,
			}
		);

		res.success({
			message: "User signed up successfully",
			user: {
				id: newUser.id,
				uuid: newUser.uuid,
				email: newUser.email,
				name: newUser.name,
			},
			token,
		});
	});
};

/**
 * Sign in an existing user
 * @param {*} req
 * @param {*} res
 */
export const signIn = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			res.status(404).json({
				message: "User not found",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			res.error({
				message: "Invalid credentials",
			});
		}

		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES_IN,
			}
		);

		res.success({
			message: "User signed in successfully",
			user: {
				id: user.id,
				uuid: user.uuid,
				email: user.email,
				name: user.name,
			},
			token,
		});
	});
};

/**
 * Sign out a user
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const signOut = (req, res) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.error({
			message: "No token provided",
			statusCode: 401,
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		jwt.verify(token, JWT_SECRET);
		return res.success({
			message: "User signed out successfully",
		});
	} catch (error) {
		return res.error({
			message: "Invalid token",
			statusCode: 401,
		});
	}
};
