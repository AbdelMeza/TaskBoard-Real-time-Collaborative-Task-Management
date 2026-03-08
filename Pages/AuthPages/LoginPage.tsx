import { useState } from "react"
import Button from "../../Components/Button/Button"

export default function LoginPage() {
    // State hooks to store user credentials initialized as empty strings
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Derived state: the button is disabled if any field is empty after trimming whitespace
    const isDisabled = username.trim() === "" || email.trim() === "" || password.trim() === ""

    return (
        <div className="loginPage">
            <div className="form-container">
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
                    <Button content="Login" isDisabled={isDisabled} />
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
            {/* Accessibility: id and htmlFor connection */}
            <label htmlFor={label}>{label}</label>
            <input
                id={label}
                type={inputType}
                value={value}
                // Extracts the string value from the change event
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}