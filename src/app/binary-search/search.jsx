import Guess from "./guess";
import Result from "./result";

export default function Search({ yesButton, noButton, upper, lower, max, onRestart }) {
    return (
        <div>
            {upper !== lower && (
                <Guess
                    yesButton={yesButton}
                    noButton={noButton}
                    upper={upper}
                    lower={lower}
                    max={max}
                />
            )}
            {upper === lower && (
                <Result res={upper} onRestart={onRestart} />
            )}
        </div>
    );
}
