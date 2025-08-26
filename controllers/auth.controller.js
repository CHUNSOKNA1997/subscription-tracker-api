import prisma from "../prisma/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		const { email, password, confirmation_password, name } = req.body;

		if (password != confirmation_password) {
			res.status(400).json({
				message: "Password and confirmation password do not match",
			});
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(409).json({
				message: "User already exists",
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

		res.status(201).json({
			message: "User created successfully",
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
			res.status(400).json({
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

		res.status(200).json({
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

export const signOut = (req, res) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: "No token provided" });
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}
	res.clearCookie("token");

	res.status(200).json({ message: "User signed out successfully" });
};
