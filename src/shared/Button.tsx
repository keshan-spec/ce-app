import { Loader } from "@/components/Loader";
import { clsx } from "clsx";
import { useFormStatus } from "react-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    fullPageLoading?: boolean;
    theme?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ fullPageLoading, icon, theme = 'primary', ...btnprops }) => {
    const { pending } = useFormStatus();

    const renderIcon = () => {
        if (pending && !fullPageLoading) {
            return <i className="ml-2 fas fa-spinner fa-spin"></i>;
        }

        if (icon) {
            return <i className="ml-2 fas fa-chevron-right"></i>;
        }
    };


    return (
        <>
            {fullPageLoading && pending && <Loader transulcent />}
            <button
                {...btnprops}
                className={clsx(
                    `btn btn-${theme} btn-block btn-lg`,
                    pending && "cursor-not-allowed bg-theme-primary-light",
                    btnprops.className
                )}
                disabled={pending}
            >
                {btnprops.children} {renderIcon()}
            </button>
        </>
    );
};