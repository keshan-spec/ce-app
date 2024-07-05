import { useRef } from "react";

interface StoreQtyButtonProps {
    onQtyChange: (qty: number) => void;
    maxQty?: number;
    defaultQty?: number;
    size?: 'sm' | 'md' | 'lg';
}

export const StoreQtyButton: React.FC<StoreQtyButtonProps> = ({ onQtyChange, maxQty, defaultQty = 1, size }) => {
    const qtyRef = useRef<HTMLInputElement>(null);

    const handleQtyChange = (type: 'up' | 'down') => {
        if (qtyRef.current) {
            const qty = parseInt(qtyRef.current.value);
            const newValue = type === 'up' ? (qty + 1).toString() : (qty - 1).toString();
            if (parseInt(newValue) < 1) {
                return;
            }

            qtyRef.current.value = newValue;

            onQtyChange(parseInt(newValue));
        }
    };

    return (
        <div className={`stepper stepper-${size}`}>
            <button className="stepper-button stepper-down"
                onClick={() => {
                    handleQtyChange('down');
                }}>-</button>
            <input type="text" className="form-control" value={defaultQty} disabled ref={qtyRef} min={1} max={maxQty} />
            <button className="stepper-button stepper-up"
                onClick={() => {
                    handleQtyChange('up');
                }}>+</button>
        </div>
    );
};