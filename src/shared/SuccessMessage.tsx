interface SuccessMessageProps {
    message: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
    message
}) => {
    return (
        <div className="flex flex-col bg-theme-dark p-2 my-2 rounded-lg bg-green-600/35 ">
            <p className="text-green-500 text-center">
                {message}
            </p>
        </div>
    );
}