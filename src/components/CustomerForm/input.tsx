// Input.tsx
import React from 'react'

type Props = {
  label: string
  name: string
  type: 'text' | 'password' | 'email'
  placeholder?: string
  required?: boolean
  defaultValue?: string
}

export const Input = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.name}>{props.label}</label>

      <input
        defaultValue={props.defaultValue ? props.defaultValue : ''}
        required={props.required}
        id={props.name}
        name={props.name}
        type={props.type}
        placeholder={
          props.placeholder
            ? props.placeholder
            : `Enter your ${props.label.toLowerCase()}`
        }
        className="w-full bg-white text-emerald-950 border border-emerald-950 rounded-md p-2 leading-tight"
      />
    </div>
  )
}
