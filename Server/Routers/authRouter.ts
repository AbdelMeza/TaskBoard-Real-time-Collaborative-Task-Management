import { Router } from "express";
import { login } from "../Controllers/authentification.ts";

const authRouter = Router()

authRouter.post("/login", login)

export default authRouter