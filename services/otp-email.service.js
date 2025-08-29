import nodemailer from "nodemailer";
import {
	EMAIL_SERVICE,
	EMAIL_USER,
	EMAIL_PASSWORD,
	EMAIL_FROM,
} from "../config/env.js";

const transporter = nodemailer.createTransport({
	service: EMAIL_SERVICE,
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASSWORD,
	},
});

/**
 * Send OTP verification email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} name - User's name
 * @returns {Promise<object>} Email send result
 */
export const sendOTPEmail = async (email, otp, name = "User") => {
	const mailOptions = {
		from: EMAIL_FROM,
		to: email,
		subject: "Help us protect your account",
		html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.5;
              color: #24292e;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
            }
            .container {
              max-width: 560px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .content {
              text-align: center;
            }
            .title {
              font-size: 32px;
              font-weight: 600;
              color: #24292e;
              margin-bottom: 32px;
              line-height: 1.2;
            }
            .description {
              font-size: 16px;
              color: #586069;
              margin-bottom: 40px;
              line-height: 1.5;
              max-width: 480px;
              margin-left: auto;
              margin-right: auto;
            }
            .otp-box {
              background-color: #f6f8fa;
              border-radius: 6px;
              padding: 24px 32px;
              display: inline-block;
              margin: 0 auto 32px;
            }
            .otp-code {
              font-size: 36px;
              font-weight: 600;
              letter-spacing: 8px;
              color: #24292e;
              font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            }
            .expiry {
              font-size: 14px;
              color: #586069;
              margin-bottom: 40px;
            }
            .warning {
              font-size: 14px;
              color: #586069;
              line-height: 1.5;
              max-width: 480px;
              margin: 0 auto 16px;
              padding: 20px 0;
            }
            .footer {
              margin-top: 48px;
              padding-top: 24px;
              border-top: 1px solid #e1e4e8;
              font-size: 12px;
              color: #959da5;
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0366d6;
              margin-bottom: 40px;
            }
            @media (max-width: 600px) {
              .container {
                padding: 30px 16px;
              }
              .title {
                font-size: 24px;
              }
              .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
              }
              .otp-box {
                padding: 20px 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="logo">Subscription Tracker</div>
              
              <h1 class="title">Help us protect your account</h1>
              
              <p class="description">
                Before you finish creating your account, we need to verify your identity. On the verification page, enter the following code.
              </p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p class="expiry">
                Your verification code expires after 10 minutes.
              </p>
              
              <p class="warning">
                You must confirm your email within 3 days of signing up. If you do not confirm your email in this timeframe, your account will be deleted and you will need to sign up for Subscription Tracker again.
              </p>
              
              <div class="footer">
                <p>This is an automated email from Subscription Tracker.</p>
                <p>If you didn't sign up for an account, you can ignore this email.</p>
                <p>© 2025 Subscription Tracker. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
		text: `
Help us protect your account

Before you finish creating your account, we need to verify your identity. On the verification page, enter the following code.

${otp}

Your verification code expires after 10 minutes.

You must confirm your email within 3 days of signing up. If you do not confirm your email in this timeframe, your account will be deleted and you will need to sign up for Subscription Tracker again.

This is an automated email from Subscription Tracker.
If you didn't sign up for an account, you can ignore this email.

© 2025 Subscription Tracker. All rights reserved.
    `,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("OTP email sent:", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending OTP email:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Send OTP resend notification email
 * @param {string} email - Recipient email
 * @param {string} otp - New OTP code
 * @param {string} name - User's name
 * @returns {Promise<object>} Email send result
 */
export const sendResendOTPEmail = async (email, otp, name = "User") => {
	const mailOptions = {
		from: EMAIL_FROM,
		to: email,
		subject: "Your new verification code",
		html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.5;
              color: #24292e;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
            }
            .container {
              max-width: 560px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .content {
              text-align: center;
            }
            .title {
              font-size: 32px;
              font-weight: 600;
              color: #24292e;
              margin-bottom: 32px;
              line-height: 1.2;
            }
            .description {
              font-size: 16px;
              color: #586069;
              margin-bottom: 40px;
              line-height: 1.5;
              max-width: 480px;
              margin-left: auto;
              margin-right: auto;
            }
            .otp-box {
              background-color: #f6f8fa;
              border-radius: 6px;
              padding: 24px 32px;
              display: inline-block;
              margin: 0 auto 32px;
            }
            .otp-code {
              font-size: 36px;
              font-weight: 600;
              letter-spacing: 8px;
              color: #24292e;
              font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            }
            .expiry {
              font-size: 14px;
              color: #586069;
              margin-bottom: 24px;
            }
            .notice {
              background-color: #fff5b1;
              border-radius: 6px;
              padding: 12px 16px;
              font-size: 14px;
              color: #735c0f;
              max-width: 480px;
              margin: 0 auto 32px;
              text-align: left;
            }
            .footer {
              margin-top: 48px;
              padding-top: 24px;
              border-top: 1px solid #e1e4e8;
              font-size: 12px;
              color: #959da5;
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0366d6;
              margin-bottom: 40px;
            }
            @media (max-width: 600px) {
              .container {
                padding: 30px 16px;
              }
              .title {
                font-size: 24px;
              }
              .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
              }
              .otp-box {
                padding: 20px 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="logo">Subscription Tracker</div>
              
              <h1 class="title">Your new verification code</h1>
              
              <p class="description">
                We've sent you a new verification code as requested. Enter the following code on the verification page.
              </p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p class="expiry">
                Your verification code expires after 10 minutes.
              </p>
              
              <div class="notice">
                ⚠️ Your previous code has been invalidated and will no longer work.
              </div>
              
              <p style="font-size: 14px; color: #586069;">
                If you continue to have issues, please contact our support team.
              </p>
              
              <div class="footer">
                <p>This is an automated email from Subscription Tracker.</p>
                <p>If you didn't request this code, you can ignore this email.</p>
                <p>© 2025 Subscription Tracker. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
		text: `
Your new verification code

We've sent you a new verification code as requested. Enter the following code on the verification page.

${otp}

Your verification code expires after 10 minutes.

⚠️ Your previous code has been invalidated and will no longer work.

If you continue to have issues, please contact our support team.

This is an automated email from Subscription Tracker.
If you didn't request this code, you can ignore this email.

© 2025 Subscription Tracker. All rights reserved.
    `,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		return { success: false, error: error.message };
	}
};
