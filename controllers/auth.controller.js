import prisma from "../prisma/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import {
	generateOTP,
	generateOTPExpiry,
	isOTPExpired,
	canResendOTP,
	isValidOTPFormat,
	OTP_CONFIG,
} from "../utils/otp.utils.js";
import {
	sendOTPEmail,
	sendResendOTPEmail,
} from "../services/otp-email.service.js";

/**
 * Sign up a new user
 * @param {*} req
 * @param {*} res
 */
export const signUp = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		const { email, password, confirmation_password, name } = req.body;

		if (password != confirmation_password) {
			return res.error({
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

		// Generate OTP and expiry
		const otp = generateOTP();
		const otpExpiry = generateOTPExpiry(OTP_CONFIG.EXPIRY_MINUTES);

		const newUser = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				emailVerified: false,
				optCode: otp,
				optCodeExpiry: otpExpiry,
				otpAttempts: 0,
				latOtpAttempt: new Date(),
			},
		});

		// Send OTP email
		const emailResult = await sendOTPEmail(email, otp, name);

		if (!emailResult.success) {
			console.error("Failed to send OTP email:", emailResult.error);
		}

		res.success({
			message:
				"User registered successfully. Please check your email for the verification code.",
			user: {
				id: newUser.id,
				uuid: newUser.uuid,
				email: newUser.email,
				name: newUser.name,
				emailVerified: newUser.emailVerified,
			},
			requiresVerification: true,
			otpSent: emailResult.success,
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
			return res.status(404).json({
				message: "User not found",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.error({
				message: "Invalid credentials",
			});
		}

		// Check if email is verified
		if (!user.emailVerified) {
			return res.error({
				message:
					"Please verify your email before signing in. Check your email for the verification code.",
				requiresVerification: true,
				email: user.email,
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
				emailVerified: user.emailVerified,
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
		});
	}
};

/**
 * Verify OTP code
 * @param {*} req
 * @param {*} res
 */
export const verifyOTP = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		const { email, otp } = req.body;

		// Validate input
		if (!email || !otp) {
			return res.error({
				message: "Email and OTP are required",
			});
		}

		// Validate OTP format
		if (!isValidOTPFormat(otp)) {
			return res.error({
				message: "Invalid OTP format. Please enter a 6-digit code.",
			});
		}

		// Find user
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.error({
				message: "User not found",
			});
		}

		// Check if already verified
		if (user.emailVerified) {
			return res.error({
				message: "Email is already verified",
			});
		}

		// Check if account is locked due to too many attempts
		if (user.otpAttempts >= OTP_CONFIG.MAX_ATTEMPTS) {
			return res.error({
				message: `Account locked due to too many failed attempts. Please try again later or request a new code.`,
				locked: true,
			});
		}

		// Check if OTP exists
		if (!user.optCode) {
			return res.error({
				message:
					"No OTP found. Please request a new verification code.",
			});
		}

		// Check if OTP is expired
		if (isOTPExpired(user.optCodeExpiry)) {
			return res.error({
				message: "OTP has expired. Please request a new code.",
				expired: true,
			});
		}

		// Verify OTP
		if (user.optCode !== otp) {
			// Increment attempts
			await prisma.user.update({
				where: { id: user.id },
				data: {
					otpAttempts: user.otpAttempts + 1,
				},
			});

			const remainingAttempts =
				OTP_CONFIG.MAX_ATTEMPTS - (user.otpAttempts + 1);

			return res.error({
				message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
				remainingAttempts,
			});
		}

		// OTP is valid - verify email
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				emailVerified: true,
				optCode: null,
				optCodeExpiry: null,
				otpAttempts: 0,
			},
		});

		// Generate JWT token
		const token = jwt.sign(
			{
				id: updatedUser.id,
				email: updatedUser.email,
			},
			JWT_SECRET,
			{
				expiresIn: JWT_EXPIRES_IN,
			}
		);

		res.success({
			message: "Email verified successfully",
			user: {
				id: updatedUser.id,
				uuid: updatedUser.uuid,
				email: updatedUser.email,
				name: updatedUser.name,
				emailVerified: updatedUser.emailVerified,
			},
			token,
		});
	});
};

/**
 * Resend OTP code
 * @param {*} req
 * @param {*} res
 */
export const resendOTP = async (req, res) => {
	await prisma.$transaction(async (prisma) => {
		const { email } = req.body;

		if (!email) {
			return res.error({
				message: "Email is required",
			});
		}

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.error({
				message: "User not found",
			});
		}

		if (user.emailVerified) {
			return res.error({
				message: "Email is already verified",
			});
		}

		// Check rate limiting
		if (
			!canResendOTP(user.latOtpAttempt, OTP_CONFIG.RESEND_DELAY_SECONDS)
		) {
			const lastAttempt = new Date(user.latOtpAttempt);
			const nextAllowed = new Date(
				lastAttempt.getTime() + OTP_CONFIG.RESEND_DELAY_SECONDS * 1000
			);
			const secondsRemaining = Math.ceil(
				(nextAllowed - new Date()) / 1000
			);

			return res.error({
				message: `Please wait ${secondsRemaining} seconds before requesting a new code.`,
				secondsRemaining,
			});
		}

		// Generate new OTP
		const newOTP = generateOTP();
		const newOTPExpiry = generateOTPExpiry(OTP_CONFIG.EXPIRY_MINUTES);

		// Update user with new OTP
		await prisma.user.update({
			where: { id: user.id },
			data: {
				optCode: newOTP,
				optCodeExpiry: newOTPExpiry,
				otpAttempts: 0,
				latOtpAttempt: new Date(),
			},
		});

		// Send new OTP email
		const emailResult = await sendResendOTPEmail(email, newOTP, user.name);

		if (!emailResult.success) {
			return res.error({
				message: "Failed to send verification email. Please try again.",
			});
		}

		res.success({
			message: "New verification code sent successfully",
			email,
			expiresIn: `${OTP_CONFIG.EXPIRY_MINUTES} minutes`,
		});
	});
};
