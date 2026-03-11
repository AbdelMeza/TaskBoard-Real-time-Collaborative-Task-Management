import { Router } from "express";
import { login } from "../Controllers/authentification";

const authRouter = Router()

authRouter.post("/login", login)

export default authRouter