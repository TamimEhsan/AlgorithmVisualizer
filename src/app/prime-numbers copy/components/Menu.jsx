import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { ALGORITHM_OPTIONS, DEFAULT_SETTINGS } from '../constants';

const Menu = ({ onChangeSpeed, onChangeValues, onVisualize, onRefresh, isDisabled, setAlgo }) => {
    const isClickable = () => {
        if (isDisabled) {
            return { cursor: "not-allowed" };
        } else {
            return {};
        }
    };

    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <CustomSelect
                title="Select Algorithm"
                options={ALGORITHM_OPTIONS}
                onChange={setAlgo}
            />
            <CustomSlider
                onChange={onChangeSpeed}
                title="speed"
                marks={false}
                defaultValue={DEFAULT_SETTINGS.DEFAULT_SPEED}
                step={1}
                min={DEFAULT_SETTINGS.MIN_SPEED}
                max={DEFAULT_SETTINGS.MAX_SPEED}
                isDisabled={false}
            />
            <CustomSlider
                onChange={onChangeValues}
                title="Total Number"
                marks={false}
                defaultValue={DEFAULT_SETTINGS.NUMBER}
                step={1}
                min={DEFAULT_SETTINGS.MIN_NUMBER}
                max={DEFAULT_SETTINGS.MAX_NUMBER}
                isDisabled={isDisabled}
            />
            <Button
                className="w-full"
                onClick={onRefresh}
                disabled={isDisabled}
                style={isClickable()}
            >
                Refresh
            </Button>
            <Button
                className="w-full"
                onClick={onVisualize}
                disabled={isDisabled}
                style={isClickable()}
            >
                Visualize
            </Button>
        </div>
    );
};

export default Menu;
