import prisma from "../prisma/prisma.js";
import userCollection from "../resources/userCollection.js";
import userResource from "../resources/userResource.js";

export const getAllUsers = async (req, res) => {
	const users = await prisma.user.findMany();

	res.status(200).json({
		success: true,
		message: "Users retrieved successfully",
		users: userCollection(users),
	});
};

export const getUserDetails = async (req, res) => {
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
};
