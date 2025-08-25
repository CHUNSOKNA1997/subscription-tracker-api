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

export const signIn = (req, res) => {
	res.json({
		message: "This is a signin API",
	});
};

export const signOut = (req, res) => {
	return { message: "This is a signout API" };
};
