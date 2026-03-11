import type { Request, Response } from "express"
import { user_model } from "../Models/user.model"
import { createToken } from "../utils/token"
import { comparePasswords } from "../utils/hashPass"

// User login controller for the task management application.
// - Validates incoming fields
// - Checks if the user exists
// - Verifies the password
// - Generates a JWT token and returns the user (without password)
export async function login(req: Request, res: Response): Promise<void> {
    type user_data_type = {
        username: string
        email: string
        password: string
    }

    try {
        const { username, email, password } = req.body as user_data_type

        // Object used only for basic validation
        const user_data: user_data_type = { username, email, password }

        const errors: { field: string; message: string }[] = []

        // --- Validate required fields ---
        if (!username || username.trim() === "") errors.push({ field: "username", message: "this field is required" })
        if (!email || email.trim() === "") errors.push({ field: "email", message: "this field is required" })
        if (!password || password.trim() === "") errors.push({ field: "password", message: "this field is required" })

        // If there are validation errors, return 400 and stop here
        if (errors.length > 0) {
            res.status(400).json({ errors })
            return
        }

        // --- Check if a user already exists with this username or email ---
        const existingUser = await user_model.findOne({ $or: [{ username }, { email }] })

        if (!existingUser) {
            res.status(400).json({
                field: "username",
                message: "Account not found",
            })
            return
        }

        // --- Verify the password using bcrypt ---
        // Reuse hashPass.comparePasswords to avoid exposing bcrypt details here.
        const isValidPassword = await comparePasswords(password, (existingUser as any).password)

        if (!isValidPassword) {
            res.status(400).json({
                field: "password",
                message: "Password is incorrect",
            })
            return
        }

        // --- Generate JWT token ---
        const token = createToken({
            id: existingUser._id,
            username: existingUser.username,
        }) as string | false

        if (!token) {
            res.status(500).json({ message: "Authentification error" })
            return
        }

        // --- Prepare the response without the password ---
        const userResponse = (existingUser as any).toObject() as {
            _id: string
            username: string
            email: string
            password?: string
        }
        delete userResponse.password

        res.status(200).json({ user: userResponse, token })
    } catch (err) {
        // Log the error for debugging and return a generic error
        console.error("Login Error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}