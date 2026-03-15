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
    authLoading: boolean
    clearErrors: () => void
    login: (values: { identifier: string, password: string }) => Promise<boolean>
    signup: (values: { username: string, email: string, password: string }) => Promise<boolean>
}

const useAuth = create<authType>((set) => ({
    user: null,
    errors: null,
    authLoading: false,

    clearErrors: () => set({ errors: null }),

    login: async (values) => {
        try {
            set({ authLoading: true })
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            const data = await res.json()
            console.log("Login Response:", data) // Debug log to check response data

            if (!res.ok) {
                set({ user: null, errors: data.errors})
                set({ authLoading: false })
                return false
            }

            set({ user: { username: data.user.username, id: data.user.id } })
            set({ authLoading: false })
            return true
        } catch (err) {
            console.log(err)
            set({ authLoading: false })
            return false
        }
    },

    signup: async (values) => {
        try {
            set({ authLoading: true })
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            const data = await res.json()

            if (!res.ok) {
                set({ user: null, errors: data.errors})
                set({ authLoading: false })
                return false
            }

            set({ user: { username: data.user.username, id: data.user.id } })
            set({ authLoading: false })
            return true
        } catch (err) {
            console.log(err)
            set({ authLoading: false })
            return false
        }
    }
}))

export default useAuth