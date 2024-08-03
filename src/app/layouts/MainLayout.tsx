'use client';
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { footerLessPaths } from "@/hooks/useTopNav";
import useLoading from "@/hooks/useLoading";
import dynamic from "next/dynamic";

const TopNav = dynamic(() => import('@/app/layouts/includes/TopNav'), { ssr: false });
const Footer = dynamic(() => import('@/app/layouts/includes/Footer'), { ssr: false });
const PullToRefreshContext = dynamic(() => import('@/app/layouts/includes/PullToRefresh'));

// Uncomment and use if skeleton loading is needed
// const ROUTE_TO_SKELETON_MAP = {
//     '/': dynamic(() => import('@/components/Posts/Posts'), { ssr: false }),
//     '/discover': dynamic(() => import('@/components/Discover/DiscoverPage'), { ssr: false }),
//     '/profile': dynamic(() => import('@/components/Profile/ProfileLayout'), { ssr: false }),
//     '/store': dynamic(() => import('@/components/Store/Products'), { ssr: false }),
// };

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const { loading, nextPage } = useLoading();

    const activePath = useMemo(() => loading && nextPage ? nextPage : pathname, [pathname, loading, nextPage]);

    const showFooter = useMemo(() => !footerLessPaths.some((path) => activePath.includes(path)), [activePath]);

    const appCapsuleClass = useMemo(() => {
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
    }, [activePath]);

    // const renderLoadingSkeleton = useMemo(() => {
    //     if (loading) {
    //         const Skeleton = nextPage && ROUTE_TO_SKELETON_MAP[nextPage as keyof typeof ROUTE_TO_SKELETON_MAP];
    //         return (
    //             <div id="appCapsule" className={appCapsuleClass}>
    //                 {Skeleton ? <Skeleton /> : <Loader transulcent />}
    //             </div>
    //         );
    //     }
    //     return null;
    // }, [loading, nextPage, appCapsuleClass]);

    return (
        <>
            <TopNav />
            {/* {renderLoadingSkeleton} */}
            <div className={clsx(
                'flex justify-between mx-auto w-full lg:px-2.5 px-0',
                pathname === '/' && 'max-w-[1140px]',
                // loading && '!-z-10',
            )}>
                <div id="appCapsule" className={clsx(appCapsuleClass)}>
                    <PullToRefreshContext>
                        {children}
                    </PullToRefreshContext>
                </div>
            </div>
            {showFooter && <Footer />}
        </>
    );
}
