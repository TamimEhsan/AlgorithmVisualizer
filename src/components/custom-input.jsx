import * as React from "react"
import { Input } from "@/components/ui/input"

// interface CustomInputProps {
//   title: string
//   value: string
//   onChange: (value: string) => void
//   type?: string
//   placeholder?: string
// }

export function CustomInput({ title, value, onChange, type = "text", placeholder }) {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor={title}
        className="text-sm font-medium whitespace-nowrap"
      >
        {title}
      </label>
      <Input
        id={title}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-[180px]"
      />
    </div>
  )
}

