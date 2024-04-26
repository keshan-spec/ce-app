
interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message
}) => {
    return (
        <div className="flex flex-col bg-theme-dark p-2 rounded-lg bg-red-600/35 my-2 w-full">
            <p className="text-red-500 text-center">
                {message}
            </p>
        </div>
    );
}