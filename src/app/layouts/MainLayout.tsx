'use client';

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "@/app/layouts/includes/TopNav";
import { Footer } from "./includes/Footer";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getQueryClient } from "../context/QueryClientProvider";
import { BiLoader } from "react-icons/bi";
import { footerLessPaths } from "@/hooks/useTopNav";

import { Loader } from "@/components/Loader";
import useLoading from "@/hooks/useLoading";
import clsx from "clsx";

const ROUTE_TO_SKELETON_MAP = {
    '/': React.lazy(() => import('@/components/Skeletons/Home')),
    '/discover': React.lazy(() => import('@/components/Skeletons/Discover')),
};

const queryClient = getQueryClient();

export default function MainLayout({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const [pullEnabled, setPullEnabled] = useState(true);

    const { loading, nextPage } = useLoading();

    const activePath = useMemo(() => {
        if (loading && nextPage) {
            return nextPage;
        }

        return pathname;
    }, [pathname, loading, nextPage]);


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setPullEnabled(true);
            } else {
                setPullEnabled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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

    const renderLoadingSkeleton = () => {
        if (loading) {
            if (nextPage && ROUTE_TO_SKELETON_MAP[nextPage as keyof typeof ROUTE_TO_SKELETON_MAP]) {
                const Skeleton = ROUTE_TO_SKELETON_MAP[nextPage as keyof typeof ROUTE_TO_SKELETON_MAP];
                return (
                    <div id="appCapsule" className={
                        getAppCapsuleClass()
                    }>
                        <Skeleton />;
                    </div>
                );
            }

            return <Loader transulcent />;
        }
    };

    return (
        <>
            <TopNav />

            {renderLoadingSkeleton()}
            <div className={clsx(
                `flex justify-between mx-auto w-full lg:px-2.5 px-0`,
                pathname == '/' ? 'max-w-[1140px]' : '',
            )}>
                <div id="appCapsule" className={clsx(
                    getAppCapsuleClass(),
                    loading ? '!-z-10 relative' : '',
                )}>
                    <PullToRefresh
                        onRefresh={handleRefresh}
                        resistance={pullEnabled ? 3 : 1}
                        pullDownThreshold={100}
                        maxPullDownDistance={110}
                        className="w-full h-full overflow-auto"
                        isPullable={pullEnabled && allowPullToRefresh()}
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
