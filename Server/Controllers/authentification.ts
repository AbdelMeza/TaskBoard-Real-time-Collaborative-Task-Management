import { createToken } from "../utils/token.ts"
import type { Request, Response } from "express"
import { user_model } from "../Models/user.model.ts"
import { comparePasswords } from "../utils/hashPass.ts"

// User login controller for the task management application.
// - Validates incoming fields
// - Checks if the user exists
// - Verifies the password
// - Generates a JWT token and returns the user (without password)
export async function login(req: Request, res: Response): Promise<void> {
    type user_data_type = {
        identifier: string
        password: string
    }

    try {
        const { identifier, password } = req.body as user_data_type

        // Object used only for basic validation
        const user_data: user_data_type = { identifier, password }

        const errors: { field: string; message: string }[] = []

        // --- Validate required fields ---
        if (!identifier || identifier.trim() === "") errors.push({ field: "identifier", message: "this field is required" })
        if (!password || password.trim() === "") errors.push({ field: "password", message: "this field is required" })

        // If there are validation errors, return 400 and stop here
        
        // --- Check if a user already exists with this username or email ---
        const existingUser = await user_model.findOne({ $or: [{ username: identifier }, { email: identifier }] })

        if (!existingUser) {
            errors.push({ field: "identifier", message: "Account not found" })
        }
        
        if (errors.length > 0) {
            res.status(400).json({ errors })
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
            id: existingUser!._id.toString(),
            username: existingUser!.username,
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

export async function signup(req: Request, res: Response): Promise<void> {
    type user_data_type = {
        identifier: string
        password: string
    }

    try {
        const { identifier, password } = req.body as user_data_type
        const errors: { field: string; message: string }[] = []

        // --- Validate required fields ---
        if (!identifier || identifier.trim() === "") errors.push({ field: "identifier", message: "this field is required" })
        if (!password || password.trim() === "") errors.push({ field: "password", message: "this field is required" })
            
            // --- Check if a user already exists with this username or email ---
        const existingUser = await user_model.findOne({ $or: [{ username: identifier }, { email: identifier }] })

        if (existingUser) {
            errors.push({ field: "identifier", message: "An account already exists with this username or email" })
            res.status(400).json({ errors })
            return
        }
        
        if (errors.length > 0) {
            res.status(400).json({ errors })
            return
        }

        // --- Create the user ---
        const newUser = await user_model.create({
            username: identifier,
            email: identifier,
            password, // The pre-save hook in the user model will hash this password
        })

        // --- Generate JWT token ---
        const token = createToken({
            id: newUser._id.toString(),
            username: newUser.username,
        }) as string | false

        if (!token) {
            res.status(500).json({ message: "Authentification error" })
            return
        }

        // --- Prepare the response without the password ---
        const userResponse = (newUser as any).toObject() as {
            _id: string
            username: string
            email: string
            password?: string
        }
        delete userResponse.password

        res.status(201).json({ user: userResponse, token })
    } catch (err) {
        // Log the error for debugging and return a generic error
        console.error("Signup Error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}