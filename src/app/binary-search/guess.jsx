import { Button } from '@/components/ui/button';
import DualHandleSlider from "./custom-dual-slider";

export default function Guess({ yesButton, noButton, upper, lower, max }) {
    const mid = Math.floor((upper + lower) / 2);

    return (
        <div>
            <div className="card card-body">
                <center style={{ justifyContent: "center" }}>
                    <DualHandleSlider upper={upper} lower={lower} max={max} />
                </center>
            </div>
            <h1 className="text-3xl">
                Is you number greater than {mid}?
            </h1>
            <br />
            <Button onClick={yesButton} className="mx-2">Yes</Button>
            <Button onClick={noButton} className="mx-2">No</Button>
            <br />
        </div>
    );
}
