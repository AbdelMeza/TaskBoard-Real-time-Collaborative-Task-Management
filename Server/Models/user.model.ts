import mongoose, { Schema } from "mongoose"

type User = {
    username: string
    email: string
    password: string
}

const user_schema = new Schema<User>({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
})

export const user_model = mongoose.model<User>("user", user_schema)