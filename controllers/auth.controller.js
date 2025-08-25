import prisma from "../prisma/prisma.js";

export const signUp = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		const email = req.body.email;
		const password = req.body.password;
		res.json({
			message: "This is a signup API",
			email,
			password,
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
