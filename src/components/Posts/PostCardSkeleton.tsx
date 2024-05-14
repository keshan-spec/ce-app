export const PostCardSkeleton: React.FC = () => {
    return (
        <div className="max-w-md w-full pt-2">
            <div className="bg-theme-dark h-full cursor-pointer">
                <div className="flex items-center px-4 py-3 bg-theme-dark">
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-theme-dark-100 animate-pulse"></div>
                    <div className="ml-3 animate-pulse">
                        <span className="rounded-full text-sm font-semibold antialiased block leading-tight dark:text-white mb-1 w-20 h-4 bg-gray-300 dark:bg-theme-dark-100"></span>
                        <span className="rounded-full text-[.6rem] font-semibold antialiased block leading-tight dark:text-gray-400 w-12 h-3 bg-gray-300 dark:bg-theme-dark-100"></span>
                    </div>
                </div>

                {/* image loading pulse */}
                <div className="w-full h-80 bg-gray-300 dark:bg-theme-dark-100 animate-pulse"></div>
                <div className="flex items-center mx-4 mt-3 mb-4 bg-theme-dark animate-pulse">
                    <div className="rounded-full font-semibold text-sm dark:text-white w-10 h-3 bg-gray-300 dark:bg-theme-dark-100"></div>
                </div>

                <div className="font-semibold text-sm mx-4 mt-2 mb-4 dark:text-white flex items-center pb-5 bg-theme-dark animate-pulse">
                    <span className="rounded-full text-sm mr-1.5 font-semibold antialiased leading-tight dark:text-white w-16 h-4 bg-gray-300 dark:bg-theme-dark-100"></span>
                    <span className="rounded-full font-normal truncate antialiased leading-tight w-48 h-3 bg-gray-300 dark:bg-theme-dark-100"></span>
                </div>
            </div>
        </div>
    );
};
