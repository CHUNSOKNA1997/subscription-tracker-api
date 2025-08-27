import prisma from "../prisma/prisma.js";
import userCollection from "../resources/userCollection.js";
import userResource from "../resources/userResource.js";
import bcrypt from "bcryptjs";

/**
 * Get all users
 * @param {*} req
 * @param {*} res
 */
export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany();

		res.success({
			message: "Users retrieved successfully",
			users: userCollection(users),
		});
	} catch (error) {
		res.error({
			message: "An error occurred while retrieving users",
			error: error.message,
		});
	}
};

/**
 * Get a single user by UUID
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUser = async (req, res) => {
	try {
		const { uuid } = req.params;
		const user = await prisma.user.findUnique({
			where: { uuid },
		});

		if (!user) {
			return res.error({
				message: "User not found",
			});
		}

		res.success({
			message: "User retrieved successfully",
			user: userResource(user),
		});
	} catch (error) {
		res.error({
			message: "An error occurred while retrieving the user",
			error: error.message,
		});
	}
};

/**
 * Create a new user
 * @param {*} req
 * @param {*} res
 */
export const createUser = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		try {
			const { name, email, password, password_confirmation } = req.body;

			const existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (existingUser) {
				return res.error({
					message: "A user with this email already exists",
				});
			}

			if (password !== password_confirmation) {
				return res.error({
					message: "Password and password confirmation do not match",
				});
			}

			const salt = await bcrypt.genSalt(10);

			const hashPassword = await bcrypt.hash(password, salt);

			const newUser = await prisma.user.create({
				data: {
					name: name,
					email: email,
					password: hashPassword,
				},
			});

			if (newUser) {
				res.success({
					message: "User created successfully",
					user: newUser,
				});
			} else {
				res.error({
					message: "Failed to create user",
				});
			}
		} catch (error) {
			res.error({
				message: "An error occurred while creating the user",
				error: error.message,
			});
		}
	});
};
