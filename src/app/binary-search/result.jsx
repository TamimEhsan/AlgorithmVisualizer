import { Button } from '@/components/ui/button';

export default function Result({ res, onRestart }) {
    return (
        <div>
            <span className="text-3xl display-3">
                Your number is {res}
            </span>
            <br />
            <Button className="btn btn-warning btn-lg" onClick={onRestart}>
                Restart
            </Button>
        </div>
    );
}
