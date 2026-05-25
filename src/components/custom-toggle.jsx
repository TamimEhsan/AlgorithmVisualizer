import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export function CustomToggle({ title, onCheckedChange, disabled }) {
    const [checked, setChecked] = useState(false)
    const onCheckedChangeCover = (checked) => {
        setChecked(checked)
        onCheckedChange(checked)
    }
    return (
        <div className="flex items-center space-x-2">
            <Switch id={title} checked={checked} onCheckedChange={onCheckedChangeCover} disabled={disabled} />
            <label
                htmlFor={title}
                className="text-sm font-medium whitespace-nowrap"
            >
                {title}
            </label>
        </div>
    )
}
