import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import { memo } from "react";

const UserNotFound: React.FC = memo(() => {
    return (
        <div className="flex flex-col items-center justify-center min-h-56 z-20 relative">
            <div className="avatar mt-10 mb-2">
                <img src={PLACEHOLDER_PFP}
                    alt="avatar" className="max-w-28 rounded-full border-2 border-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">User Not Found</h1>
        </div>
    );
});

export default UserNotFound;