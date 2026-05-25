import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CustomSelect({ title, options, onChange, disabled }) {
  const [value, setValue] = useState(0)
  const onChangeCover = (value) => {
    setValue(value)
    onChange(value)
  }
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium whitespace-nowrap">{title}</label>
      <Select value={value} onValueChange={onChangeCover} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, idx) => (
            <SelectItem key={idx} value={idx}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
