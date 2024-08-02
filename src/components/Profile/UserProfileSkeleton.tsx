import { memo } from "react";

export const UserProfileSkeleton: React.FC = memo(() => {
    return (
        <>
            <div className="section !p-0 relative bg-gray-300" style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                <div className="flex flex-col items-center justify-center min-h-56 z-20 relative">
                    <div className="avatar mt-10">
                        <div className="w-28 h-28 rounded-full border-2 border-white bg-gray-200 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center mt-2 gap-y-1">
                        <div className="h-4 w-24 bg-gray-200 animate-pulse mb-1 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                </div>
                <div className="bg-gradient-to-b from-transparent to-white h-60 w-full absolute -bottom-1" />
            </div>

            <div className="section full">
                <div className="profile-stats !justify-center gap-4 ps-2 pe-2">
                    <a href="#" className="item">
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded mb-1"></div>
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                    </a>
                    <a href="#" className="item">
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded mb-1"></div>
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                    </a>
                    <a href="#" className="item">
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded mb-1"></div>
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                    </a>
                </div>
            </div>

            <div className="section mt-1 mb-2">
                <div className="profile-info">
                    <div className="mt-3 flex flex-col gap-2 items-center w-full">
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>

                    <div className="mt-4 bio">
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="tabs-skeleton flex gap-2 px-3">
                    <div className="h-10 w-36 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-36 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-36 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>
        </>
    );
});