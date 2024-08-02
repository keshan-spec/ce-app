'use client';

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import PullToRefresh from 'react-simple-pull-to-refresh';
import clsx from "clsx";
import { BiLoader } from "react-icons/bi";
import { getQueryClient } from "../context/QueryClientProvider";
import { footerLessPaths } from "@/hooks/useTopNav";
import useLoading from "@/hooks/useLoading";

import dynamic from "next/dynamic";

const TopNav = dynamic(() => import('@/app/layouts/includes/TopNav'));
const Footer = dynamic(() => import('@/app/layouts/includes/Footer'));

// const ROUTE_TO_SKELETON_MAP = {
//     '/': React.lazy(() => import('@/components/Posts/Posts')),
//     '/discover': React.lazy(() => import('@/components/Home/Home')),
//     '/profile': React.lazy(() => import('@/components/Profile/ProfileLayout')),
// };

const queryClient = getQueryClient();

export default function MainLayout({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();

    const { loading, nextPage } = useLoading();

    const activePath = useMemo(() => {
        if (loading && nextPage) {
            return nextPage;
        }

        return pathname;
    }, [pathname, loading, nextPage]);

    const allowPullToRefresh = () => {
        if (pathname.includes('/checkout') || pathname.includes('/checkout/payment-success')
            || pathname.includes('/profile/edit/') || pathname.includes('/discover')
        ) {
            return false;
        }

        return true;
    };

    const showFooter = () => {
        if (footerLessPaths.some((path) => activePath.includes(path))) {
            return false;
        }

        return true;
    };

    const getAppCapsuleClass = () => {
        switch (activePath) {
            case '/':
                return 'social';
            case '/discover':
            case '/search':
                return 'extra-header-active';
            case '/store':
                return 'store';
            default:
                return '';
        }
    };

    const handleRefresh = async () => {
        await queryClient.resetQueries();
    };

    // const renderLoadingSkeleton = useCallback(() => {
    //     if (loading) {
    //         if (nextPage && ROUTE_TO_SKELETON_MAP[nextPage as keyof typeof ROUTE_TO_SKELETON_MAP]) {
    //             const Skeleton = ROUTE_TO_SKELETON_MAP[nextPage as keyof typeof ROUTE_TO_SKELETON_MAP];
    //             return (
    //                 <div id="appCapsule" className={
    //                     getAppCapsuleClass()
    //                 }>
    //                     <Skeleton />
    //                     {/* <Loader transulcent /> */}
    //                 </div>
    //             );
    //         }

    //         return <Loader transulcent />;
    //     }

    //     return null;
    // }, [loading, nextPage]);


    return (
        <>
            <TopNav />

            {/* {renderLoadingSkeleton()} */}

            <div className={clsx(
                `flex justify-between mx-auto w-full lg:px-2.5 px-0`,
                pathname == '/' ? 'max-w-[1140px]' : '',
            )}>
                <div id="appCapsule" className={clsx(
                    getAppCapsuleClass(),
                    // loading ? '!-z-10 relative' : '',
                )}>
                    <PullToRefresh
                        onRefresh={handleRefresh}
                        resistance={true ? 3 : 1}
                        pullDownThreshold={100}
                        maxPullDownDistance={110}
                        className="w-full h-full overflow-auto"
                        isPullable={true && allowPullToRefresh()}
                        pullingContent={
                            <div className="text-center flex items-center text-black w-full mt-2">
                                <BiLoader className="text-3xl w-full" />
                            </div>
                        }
                        refreshingContent={
                            <div className="text-center flex items-center text-black w-full mt-2">
                                <BiLoader className="text-3xl animate-spin w-full" />
                            </div>
                        }
                    >
                        <>
                            {children}
                        </>
                    </PullToRefresh>
                </div>
            </div>

            {showFooter() && (
                <Footer />
            )}
        </>
    );
}
