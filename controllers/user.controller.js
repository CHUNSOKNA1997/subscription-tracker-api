import prisma from "../prisma/prisma.js";

export const getAllUsers = async (req, res) => {
	const users = await prisma.user.findMany();

	res.status(200).json({
		message: "Users retrieved successfully",
		users,
	});
};

export const getUserByUuid = async (req, res) => {
	const { uuid } = req.params;
	const user = await prisma.user.findUnique({
		where: { uuid },
	});

	if (!user) {
		return res.status(404).json({
			message: "User not found",
		});
	}

	res.status(200).json({
		message: "User retrieved successfully",
		user,
	});
};
