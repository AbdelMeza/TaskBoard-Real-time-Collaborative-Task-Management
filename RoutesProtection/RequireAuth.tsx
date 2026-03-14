import React from "react";
import useAuth from "../Stores/useAuth"
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    if(!user) {
        navigate("/login")
    }

    return children;
}