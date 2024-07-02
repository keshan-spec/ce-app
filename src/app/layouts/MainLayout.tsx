'use client';

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "@/app/layouts/includes/TopNav";
import { Footer } from "./includes/Footer";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { getQueryClient } from "../context/QueryClientProvider";
import { BiLoader } from "react-icons/bi";

const queryClient = getQueryClient();

export default function MainLayout({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const [pullEnabled, setPullEnabled] = useState(true);

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

    const showMenuIcon = () => {
        if (pathname.includes('/profile') || pathname.includes('/post/')) {
            return false;
        }

        return true;
    };

    const getAppCapsuleClass = () => {
        switch (pathname) {
            case '/':
                return 'social';
            case '/discover':
                return 'discover';
            case '/store':
                return 'store';
            default:
                return '';
        }
    };

    const handleRefresh = async () => {
        await queryClient.resetQueries();
    };

    return (
        <>
            <div className={`flex justify-between mx-auto w-full lg:px-2.5 px-0 ${pathname == '/' ? 'max-w-[1140px]' : ''}`}>
                <TopNav />
                <div id="appCapsule" className={getAppCapsuleClass()}>
                    <PullToRefresh
                        onRefresh={handleRefresh}
                        resistance={pullEnabled ? 3 : 1}
                        pullDownThreshold={100}
                        maxPullDownDistance={110}
                        className="w-full h-full overflow-auto"
                        isPullable={pullEnabled}
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
                {showMenuIcon() && (
                    <Footer />
                )}
            </div>
        </>
    );
}
