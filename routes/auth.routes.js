import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/v1/auth/signup", signUp);

authRouter.post("/v1/auth/signin", signIn);

authRouter.post("/v1/auth/signout", signOut);

export default authRouter;
