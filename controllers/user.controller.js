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

/**
 * Update an existing user
 * @param {*} req
 * @param {*} res
 */
export const updateUser = async (req, res) => {
	try {
		await prisma.$transaction(async (prisma) => {
			const { uuid } = req.params;

			const { name, email } = req.body;

			const user = await prisma.user.findUnique({
				where: { uuid },
			});

			if (!user) {
				return res.error({
					message: "User not found",
				});
			}

			if (email === user.email && name === user.name) {
				return res.error({
					message:
						"You must provide at least one different value to update",
				});
			}

			if (email && email !== user.email) {
				const emailExists = await prisma.user.findUnique({
					where: { email },
				});

				if (emailExists) {
					return res.error({
						message: "A user with this email already exists",
					});
				}
			}

			const updatedUser = await prisma.user.update({
				where: { uuid },
				data: {
					name: name || user.name,
					email: email || user.email,
				},
			});

			res.success({
				message: "User updated successfully",
				user: userResource(updatedUser),
			});
		});
	} catch (error) {
		res.error({
			message: "An error occurred while updating the user",
			error: error.message,
		});
	}
};

/**
 * Delete a user by UUID
 * @param {*} req
 * @param {*} res
 */
export const deleteUser = async (req, res) => {
	try {
		await prisma.$transaction(async (prisma) => {
			const { uuid } = req.params;

			const user = await prisma.user.findUnique({
				where: { uuid },
			});

			if (!user) {
				return res.error({
					message: "User not found",
				});
			}

			await prisma.user.delete({
				where: { uuid },
			});

			res.success({
				message: "User deleted successfully",
			});
		});
	} catch (error) {
		res.error({
			message: "An error occurred while deleting the user",
			error: error.message,
		});
	}
};

/**
 * Change user password
 * @param {*} req
 * @param {*} res
 */
export const changePassword = async (req, res) => {
	try {
		await prisma.$transaction(async (prisma) => {
			const { current_password, new_password, password_confirmation } =
				req.body;
			const user = await prisma.user.findUnique({
				where: { uuid: req.params.uuid },
			});

			if (new_password !== password_confirmation) {
				return res.error({
					message: "Password and password confirmation do not match",
				});
			}

			if (!user) {
				return res.error({
					message: "User not found",
				});
			}

			const isMatch = await bcrypt.compare(
				current_password,
				user.password
			);

			if (!isMatch) {
				return res.error({
					message: "Current password is incorrect",
				});
			}

			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(new_password, salt);

			await prisma.user.update({
				where: { uuid: req.params.uuid },
				data: { password: hashPassword },
			});

			res.success({
				message: "Password changed successfully",
			});
		});
	} catch (error) {
		res.error({
			message: "An error occurred while changing the password",
			error: error.message,
		});
	}
};
