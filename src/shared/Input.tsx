import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import { closeCircle } from "ionicons/icons";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    className, error, ...props
}) => {
    return (
        <div className="form-group boxed">
            <div className="input-wrapper">
                <input
                    {...props}
                    className={clsx(
                        "form-control",
                        className,
                        error ? "!border-red-600" : ""
                    )}
                />
                <i className="clear-input">
                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                </i>
            </div>
            {error && <div className="text-red-600 text-left text-xs mt-1">{error}</div>}
        </div>
    );
};