'use client';
import { usePathname } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import { getQueryClient } from "../../context/QueryClientProvider";

// import PullToRefresh from 'react-simple-pull-to-refresh';
import dynamic from "next/dynamic";
import { usePage } from "@/app/context/PageProvider";
import { useCallback, useMemo } from "react";
import clsx from "clsx";

const PullToRefresh = dynamic(() => import('react-simple-pull-to-refresh'), { ssr: false });

// Pages
const HomePage = dynamic(() => import('@/pageless-components/Home'));
const DiscoverPage = dynamic(() => import("@/components/Discover/DiscoverPage"));
const StorePage = dynamic(() => import("@/pageless-components/Store"));
const ProfilePage = dynamic(() => import('@/components/Profile/ProfileLayout'));

const queryClient = getQueryClient();

export default function PullToRefreshContext({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const { activePage } = usePage();

    const allowPullToRefresh = () => {
        if (pathname.includes('/checkout') || pathname.includes('/checkout/payment-success')
            || pathname.includes('/profile/edit/') || pathname.includes('/discover')
        ) {
            return false;
        }

        return true;
    };

    const handleRefresh = async () => {
        await queryClient.resetQueries();
    };

    const renderChildren = useCallback(() => {
        if (pathname !== '/') {
            return children;
        }

        if (activePage === 'home') {
            return <HomePage />;
        }

        if (activePage === 'discover') {
            return <DiscoverPage />;
        }

        if (activePage === 'store') {
            return <StorePage />;
        }

        if (activePage === 'profile') {
            return <ProfilePage />;
        }

        return children;
    }, [activePage, children, pathname]);

    const appCapsuleClass = useMemo(() => {
        if (activePage === 'home') {
            return 'social';
        }

        if (activePage === 'discover' || activePage === 'search') {
            return 'extra-header-active';
        }

        if (activePage === 'store') {
            return 'store';
        }

        switch (pathname) {
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
    }, [pathname, activePage]);

    return (
        <div className={clsx(
            'flex justify-between mx-auto w-full lg:px-2.5 px-0',
            pathname === '/' && 'max-w-[1140px]',
        )}>
            <div id="appCapsule" className={clsx(appCapsuleClass)}>
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
                        {renderChildren()}
                    </>
                </PullToRefresh>
            </div>
        </div>

    );
}
