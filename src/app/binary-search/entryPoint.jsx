import { CustomInput } from '@/components/custom-input';
import { Button } from '@/components/ui/button';

export default function EntryPoint({ startGame, upper, setUpper }) {
    const setData = (val) => {
        if (val === "") val = 0;
        setUpper(val);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <CustomInput
                title="Upper Number"
                defaultValue={100}
                type="number"
                onChange={setData}
                placeholder="Enter value..."
            />
            <br /><br />
            <h1 className="text-3xl">
                Guess a number between 0 and {upper}
            </h1>
            <br />
            <Button onClick={startGame}>
                Start the game
            </Button>
        </div>
    );
}
