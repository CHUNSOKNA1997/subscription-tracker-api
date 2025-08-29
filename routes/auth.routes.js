import { Router } from "express";
import {
	signIn,
	signOut,
	signUp,
	verifyOTP,
	resendOTP,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/v1/auth/signup", signUp);

authRouter.post("/v1/auth/signin", signIn);

authRouter.post("/v1/auth/signout", signOut);

authRouter.post("/v1/auth/verify-otp", verifyOTP);

authRouter.post("/v1/auth/resend-otp", resendOTP);

export default authRouter;
