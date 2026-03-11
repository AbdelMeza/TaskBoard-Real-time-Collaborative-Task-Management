import { create } from "zustand"
const API_URL: string | undefined = import.meta.env.VITE_API_URL

type userType = {
    username: string
    id: string
}

type errorType = {
    field: string
    message: string
}

type authType = {
    user: null | userType
    errors: null | errorType[]
    login: (values: { username: string, email: string, password: string }) => Promise<boolean>
}

const useAuth = create<authType>((set) => ({
    user: null,
    errors: null,

    login: async (values) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            const data = await res.json()

            if (!res.ok) {
                set({ user: null, errors: [{ field: "global", message: "Login failed" }] })
                return false
            }

            set({ user: { username: data.user.username, id: data.user.id } })
            return true
        } catch (err) {
            return false
            console.log(err)
        }
    }
}))

export default useAuth