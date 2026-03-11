import './AuthPages.scss'
import { useState } from "react"
import Input from "../../Components/Inputs/Inputs"
import Button from "../../Components/Button/Button"
import useAuth from '../../Stores/useAuth'

export default function LoginPage() {
    // State hooks to store user credentials initialized as empty strings
    const { login } = useAuth()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Derived state: the button is disabled if any field is empty after trimming whitespace
    const isDisabled = username.trim() === "" || email.trim() === "" || password.trim() === ""

    const handleSubmit = () => {
        if (isDisabled) return

        login({ username, email, password })
    }

    return (
        <div className="login-page">
            <div className="form-container">
                <div className="form-content">
                    <div className="upper-content">
                        {/* Reusable input components with two-way data binding */}
                        <InputsContainer
                            label="Username"
                            inputType="text"
                            value={username}
                            onChange={(value) => setUsername(value)}
                        />
                        <InputsContainer
                            label="Email"
                            inputType="email"
                            value={email}
                            onChange={(value) => setEmail(value)}
                        />
                        <InputsContainer
                            label="Password"
                            inputType="password"
                            value={password}
                            onChange={(value) => setPassword(value)}
                        />
                    </div>
                    <div className="lower-content">
                        {/* The button receives the calculated disabled state */}
                        <div onClick={handleSubmit}>
                            <Button type="main" size={2} content="Login" isDisabled={isDisabled} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Type definition for the InputsContainer props
type InputsContainerProps = {
    label: string
    inputType: string
    value: string
    onChange: (value: string) => void
}

/**
 * Functional component for a labeled input field
 * It notifies the parent of changes via the onChange callback
 */
function InputsContainer({ label, inputType, value, onChange }: InputsContainerProps) {
    return (
        <div className="inputs-container">
            <label htmlFor={label}>{label}</label>
            <Input
                id={label}
                placeholder={""}
                inputType={inputType}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}