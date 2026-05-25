import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export function CustomSlider({ title, onChange, min, max, step, defaultValue, disabled }) {
    const [value, setValue] = useState(defaultValue)
    const onChangeCover = (values) => {
        const val = values[0]
        setValue(val)
        onChange(val)
    }

    return (
      <div className="space-y-2">
      <label className="text-sm font-medium whitespace-nowrap">{title}</label>
      <Slider
        value={[value]}
        onValueChange={onChangeCover}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full"
      />
      <span className="text-sm text-gray-500 w-8">{value}</span>
    </div>
  )
}
