import './AuthPages.scss'
import { useState } from "react"
import Input from "../../Components/Inputs/Inputs"
import Button from "../../Components/Button/Button"
import useAuth from '../../Stores/useAuth'

export default function LoginPage() {
    const { login, errors } = useAuth()
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")

    // Form submission handler
    const handleSubmit = async () => {
        const success = await login({ identifier, password })
        if (success) {
            // Logic for redirection could go here
        }
    }

    // Helper to find a specific error message by field name
    const getFieldError = (fieldName: string) => {
        return errors?.find(e => e.field === fieldName)?.message
    }

    return (
        <div className="login-page">
            <div className="form-container">
                <div className="form-content">
                    <div className="upper-content">
                        <InputsContainer
                            label="Username or email"
                            inputType="text"
                            value={identifier}
                            onChange={setIdentifier}
                            error={getFieldError("identifier")}
                        />
                        <InputsContainer
                            label="Password"
                            inputType="password"
                            value={password}
                            onChange={setPassword}
                            error={getFieldError("password")}
                        />
                    </div>
                    <div className="lower-content">
                        {/* Using a wrapper div or a dedicated button prop for click events */}
                        <div onClick={handleSubmit}>
                            <Button type="main" size={2} content="Login" isDisabled={false}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

type InputsContainerProps = {
    label: string
    inputType: string
    value: string
    onChange: (value: string) => void
    error?: string // Changed to optional
}

function InputsContainer({ label, inputType, value, onChange, error }: InputsContainerProps) {
    return (
        <div className="inputs-container">
            <label htmlFor={label}>{label}</label>
            <Input
                id={label}
                placeholder={""}
                inputType={inputType}
                value={value}
                hasError={!!error}
                onChange={onChange}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    )
}