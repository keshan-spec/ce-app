import { Loader } from "@/components/Loader";
import { clsx } from "clsx";
import { useFormStatus } from "react-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    fullPageLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ fullPageLoading, icon, ...btnprops }) => {
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
            {fullPageLoading && pending && <Loader />}
            <button
                {...btnprops}
                className={clsx(
                    "uppercase bg-theme-primary w-full hover:bg-theme-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
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