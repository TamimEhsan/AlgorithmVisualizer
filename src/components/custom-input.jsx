import * as React from "react"
import { Input } from "@/components/ui/input"

// interface CustomInputProps {
//   title: string
//   value: string
//   onChange: (value: string) => void
//   type?: string
//   placeholder?: string
// }

export function CustomInput({ title, defaultValue = "", onChange, type = "text", placeholder }) {
  const [value, setInputValue] = React.useState(defaultValue)
  const onInputChange = (value) => {
    setInputValue(value)
    onChange(value)
  }
  return (
    <div className="space-y-2">
    {/* <div className="flex items-center space-x-2"> */}
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
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
        // className="w-[180px]"
      />
    </div>
  )
}

