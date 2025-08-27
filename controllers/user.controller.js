import prisma from "../prisma/prisma.js";
import userCollection from "../resources/userCollection.js";
import userResource from "../resources/userResource.js";

export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany();

		res.status(200).json({
			success: true,
			message: "Users retrieved successfully",
			users: userCollection(users),
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while retrieving users",
			error: error.message,
		});
	}
};

export const getUser = async (req, res) => {
	try {
		const { uuid } = req.params;
		const user = await prisma.user.findUnique({
			where: { uuid },
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User retrieved successfully",
			user: userResource(user),
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "An error occurred while retrieving the user",
			error: error.message,
		});
	}
};
