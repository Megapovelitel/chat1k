import { useId, useState, type ChangeEvent } from 'react'

type TextFieldProps = {
    label?: string
}

export const TextField = ({ label }: TextFieldProps) => {
    const id = useId()
    const [value, setValue] = useState('')

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    return (
        <div>
            {label ? <label htmlFor={id}>{label}</label> : null}
            <input id={id} value={value} onChange={handleChange} />
        </div>
    )
}
