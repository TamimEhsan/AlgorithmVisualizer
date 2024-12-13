import { Slider } from "@/components/ui/slider"

// interface DualHandleSliderProps {
//   min?: number
//   max?: number
//   step?: number
//   defaultValue?: [number, number]
//   onValueChange?: (values: [number, number]) => void
//   className?: string
// }

const DualHandleSlider = ({lower = 0, upper = 100, max = 100 }) => {
    console.log(lower, upper, max)
    return (
        <Slider
            value={[lower, upper]}
            max={max}
            min={0}
            disabled={true}
            className="w-[240px]"
        />
    )
}

export default DualHandleSlider;