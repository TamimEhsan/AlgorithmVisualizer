import { Slider } from "@/components/ui/slider"

const DualHandleSlider = ({ lower = 0, upper = 100, max = 100 }) => {
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
