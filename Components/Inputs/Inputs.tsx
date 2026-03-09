import i from "./Inputs.module.scss"

type InputType = {
    id: string,
    inputType: string,
    value: string,
    onChange: (value: string) => void
    placeholder: string
}

export default function Input({ id, inputType, value, onChange, placeholder }: InputType) {
    return (
        <input
            id={id}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`input-element ${i.input}`}
        />
    )
}