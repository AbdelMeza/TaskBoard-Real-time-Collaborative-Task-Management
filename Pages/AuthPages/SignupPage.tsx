import "./AuthPages.scss";
import { useState } from "react";
import Input from "../../Components/Inputs/Inputs";
import Button from "../../Components/Button/Button";
import useAuth from "../../Stores/useAuth";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { signup, errors } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form submission handler
  const handleSubmit = async () => {
    const success = await signup({ username, email, password });
    if (success) {
      navigate("/"); // Redirect to home page on successful signup
    }
  };

  // Helper to find a specific error message by field name
  const getFieldError = (fieldName: string) => {
    return errors?.find((e) => e.field === fieldName)?.message;
  };

  return (
    <div className="signup-page">
      <div className="form-container">
        <div className="form-content">
          <div className="upper-content">
            <InputsContainer
              label="username"
              inputType="text"
              value={username}
              onChange={setUsername}
              error={getFieldError("username")}
            />
            <InputsContainer
              label="Email"
              inputType="text"
              value={email}
              onChange={setEmail}
              error={getFieldError("email")}
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
              <Button type="main" size={2} content="Create account" isDisabled={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type InputsContainerProps = {
  label: string;
  inputType: string;
  value: string;
  onChange: (value: string) => void;
  error?: string; // Changed to optional
};

function InputsContainer({
  label,
  inputType,
  value,
  onChange,
  error,
}: InputsContainerProps) {
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
  );
}
