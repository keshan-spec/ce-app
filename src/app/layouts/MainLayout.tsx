'use client';
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { footerLessPaths } from "@/hooks/useTopNav";
import dynamic from "next/dynamic";

const TopNav = dynamic(() => import('@/app/layouts/includes/TopNav'));
const Footer = dynamic(() => import('@/app/layouts/includes/Footer'));
const PullToRefreshContext = dynamic(() => import('@/app/layouts/includes/PullToRefresh'));
import AnimatedLayout from "@/shared/AnimatedLayout";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const showFooter = useMemo(() => !footerLessPaths.some((path) => pathname.includes(path)), [pathname]);

    const appCapsuleClass = useMemo(() => {
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
    }, [pathname]);

    return (
        <>
            <AnimatedLayout>
                <TopNav />

                <div className={clsx(
                    'flex justify-between mx-auto w-full lg:px-2.5 px-0',
                    pathname === '/' && 'max-w-[1140px]',
                    pathname.includes('/post/') && 'overflow-hidden max-h-screen',
                )}>
                    <div id="appCapsule" className={clsx(appCapsuleClass)}>
                        <PullToRefreshContext>
                            {children}
                        </PullToRefreshContext>
                    </div>
                </div>
            </AnimatedLayout>
            {showFooter && <Footer />}
        </>
    );
}
