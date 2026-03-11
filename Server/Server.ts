import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import authRouter from "./Routers/authRouter"

dotenv.config()

const PORT: string | number = process.env.PORT || 5130
const MONGODB_URL: string | undefined = process.env.MONGODB_URL

const app = express()
app.use(cors())
app.use(express.json())

if (!MONGODB_URL) {
    //If database url is not defined force server shutdown
    console.error("Error: MONGODB_URL is not defined in .env")
    process.exit(1)
}

// 1. Define the connection function FIRST
const connectDB = async (): Promise<void> => {
    try {
        // MUST use await here to catch potential errors
        await mongoose.connect(MONGODB_URL as string)
        console.log("Connected to MongoDB")
    } catch (err) {
        console.error("MongoDB connection error:", err)
        process.exit(1)
    }
}

// 2. Start the server and THEN call the function
const server = app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`)
    connectDB()
})

// --- GRACEFUL SHUTDOWN MANAGEMENT (SIGTERM / SIGINT) ---

const gracefulShutdown = (signal: string) => {
    console.log(`\n${signal} received. Closing server...`)

    // Stop the Express server first (no more new requests)
    server.close(async () => {
        console.log("HTTP server closed.")

        try {
            // Then close the database connection
            await mongoose.connection.close()
            console.log("MongoDB connection closed.")

            // Exit cleanly with code 0 (Success)
            process.exit(0)
        } catch (err) {
            console.error("Error during MongoDB closure:", err)
            process.exit(1)
        }
    })

    // Force exit after a safety timeout (e.g., 10s) if server takes too long
    setTimeout(() => {
        console.error("Forced shutdown after safety timeout.")
        process.exit(1)
    }, 10000)
}

// Listen for system signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")) // Sent by hosts (Docker, PM2)
process.on("SIGINT", () => gracefulShutdown("SIGINT"))   // Sent by Ctrl+C in terminal

app.use("/auth", authRouter)