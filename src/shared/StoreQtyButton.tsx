import { memo, useCallback, useRef, useState } from "react";

interface StoreQtyButtonProps {
    onQtyChange: (qty: number) => void;
    maxQty?: number;
    defaultQty?: number;
    size?: 'sm' | 'md' | 'lg';
}

export const StoreQtyButton: React.FC<StoreQtyButtonProps> = memo(({
    onQtyChange,
    maxQty,
    defaultQty = 1,
    size,
}) => {
    const [qty, setQty] = useState(defaultQty);

    const handleQtyChange = useCallback(
        (type: "up" | "down") => {
            let newValue;
            if (type === "up") {
                newValue = qty + 1;
            } else {
                newValue = qty - 1;
            }

            if (newValue < 1) {
                newValue = 1; // Ensure quantity doesn't go below 1
            } else {
                if (maxQty && newValue > maxQty) {
                    newValue = maxQty; // Ensure quantity doesn't exceed maxQty
                }
            }

            setQty(newValue);
            onQtyChange(newValue);
        },
        [qty, maxQty, onQtyChange]
    );

    return (
        <div className={`stepper stepper-${size}`}>
            <button
                className="stepper-button stepper-down"
                onClick={() => handleQtyChange("down")}
                disabled={qty <= 1}
            >
                -
            </button>
            <input
                type="number"
                className="form-control"
                value={qty}
                readOnly
                min={1}
                max={maxQty}
            />
            <button
                className="stepper-button stepper-up"
                onClick={() => handleQtyChange("up")}
                disabled={maxQty ? qty >= maxQty : false}
            >
                +
            </button>
        </div>
    );
});
