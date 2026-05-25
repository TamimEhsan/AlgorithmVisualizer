import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';

export default function Menu({ onStart, onStop, onClear, isRunning }) {
    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
        <h2 className="text-lg font-semibold">Settings</h2>

            <Button className="m-1" onClick={onClear} disabled={isRunning}>Clear Board</Button>
            <Button className="w-full" onClick={onStop} disabled={!isRunning}>Stop Simulation</Button>
            <Button className="w-full" onClick={onStart} disabled={isRunning}>Start Simulation</Button>
        </div>
    );
}

Menu.propTypes = {
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};