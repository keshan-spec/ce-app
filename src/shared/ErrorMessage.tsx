
interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message
}) => {
    if (!message) {
        return null;
    }

    return (
        <div className="flex flex-col bg-red-200 p-1 rounded-lg bg-red-600/35 my-2 w-full">
            <span className="text-red-500 text-center">
                {message}
            </span>
        </div>
    );
};