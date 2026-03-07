import { Server as HttpServer } from "http"
import { Server, Socket } from "socket.io"

let io: Server | null = null

export const initSocket = (server: HttpServer): Server => {
    io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true
        }
    })

    io.on("connection", (socket: Socket) => {
        // userId should ideally be typed, here we expect an object
        socket.on("user:join", ({ userId }: { userId: string | number }) => {
            console.log("Joined room:", userId)
            socket.join(userId.toString())
        })

        socket.on("disconnect", () => {
            console.log("User disconnected")
        })
    })

    return io
}

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initSocket first.")
    }
    return io
}