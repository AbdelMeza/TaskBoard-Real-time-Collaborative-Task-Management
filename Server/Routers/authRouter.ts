import { Router } from "express";
import { login, signup } from "../Controllers/authentification.ts";

const authRouter = Router()

authRouter.post("/login", login)
authRouter.post("/signup", signup)

export default authRouter