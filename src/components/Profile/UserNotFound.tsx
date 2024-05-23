export const UserNotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-56 z-20 relative">
            <div className="avatar mt-10">
                <img src="/images/avatars/avatar.png" alt="avatar" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">User Not Found</h1>
        </div>
    );
};