import crypto from "crypto";

/**
 * Generate a secure 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
	// Using crypto for more secure random number generation
	return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate OTP expiry time
 * @param {number} minutes - Number of minutes until expiry (default: 10)
 * @returns {Date} Expiry datetime
 */
export const generateOTPExpiry = (minutes = 10) => {
	const expiry = new Date();
	expiry.setMinutes(expiry.getMinutes() + minutes);
	return expiry;
};

/**
 * Check if OTP is expired
 * @param {Date} expiryTime - OTP expiry time
 * @returns {boolean} True if expired
 */
export const isOTPExpired = (expiryTime) => {
	if (!expiryTime) return true;
	return new Date() > new Date(expiryTime);
};

/**
 * Check if enough time has passed for OTP resend
 * @param {Date} lastAttempt - Last OTP request time
 * @param {number} seconds - Required seconds between requests (default: 60)
 * @returns {boolean} True if can resend
 */
export const canResendOTP = (lastAttempt, seconds = 60) => {
	if (!lastAttempt) return true;

	const now = new Date();
	const lastAttemptTime = new Date(lastAttempt);
	const timeDiff = (now - lastAttemptTime) / 1000; // Convert to seconds

	return timeDiff >= seconds;
};

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @returns {boolean} True if valid format
 */
export const isValidOTPFormat = (otp) => {
	if (!otp || typeof otp !== "string") return false;
	// Check if it's exactly 6 digits
	return /^\d{6}$/.test(otp);
};

/**
 * Mask email for privacy
 * @param {string} email - Email to mask
 * @returns {string} Masked email
 */
export const maskEmail = (email) => {
	const [localPart, domain] = email.split("@");
	const maskedLocal =
		localPart.slice(0, 2) + "***" + localPart.slice(-1);
	return `${maskedLocal}@${domain}`;
};

/**
 * Calculate remaining time for OTP
 * @param {Date} expiryTime - OTP expiry time
 * @returns {object} Remaining time in minutes and seconds
 */
export const getRemainingTime = (expiryTime) => {
	if (!expiryTime) return { minutes: 0, seconds: 0 };

	const now = new Date();
	const expiry = new Date(expiryTime);
	const diff = expiry - now;

	if (diff <= 0) return { minutes: 0, seconds: 0 };

	const minutes = Math.floor(diff / 60000);
	const seconds = Math.floor((diff % 60000) / 1000);

	return { minutes, seconds };
};

/**
 * OTP configuration constants
 */
export const OTP_CONFIG = {
	EXPIRY_MINUTES: 10,
	MAX_ATTEMPTS: 5,
	RESEND_DELAY_SECONDS: 60,
	MAX_RESENDS_PER_HOUR: 3,
	LOCKOUT_DURATION_MINUTES: 60,
};