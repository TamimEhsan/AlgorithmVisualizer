import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



export function CustomSelect({ title, options, onChange }) {
  const [value, setValue] = React.useState(0)
  const onChangeCover = (value) => {
    setValue(value)
    onChange(value)
  }
  return (
    <div className="space-y-2">
      {/* <div className="flex items-center space-x-2">  */}
      <label className="text-sm font-medium whitespace-nowrap">{title}</label>
      <Select value={value} onValueChange={onChangeCover}>
        <SelectTrigger className="w-full">
        {/* <SelectTrigger className="w-[180px]"> */}
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

