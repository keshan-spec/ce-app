'use client';

import React from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "@/app/layouts/includes/TopNav";
import { Footer } from "./includes/Footer";
import clsx from "clsx";

export default function MainLayout({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();

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

    return (
        <>
            <div className={`flex justify-between mx-auto w-full lg:px-2.5 px-0 ${pathname == '/' ? 'max-w-[1140px]' : ''}`}>
                <TopNav />
                <div id="appCapsule" className={getAppCapsuleClass()}>
                    {children}
                </div>
                {showMenuIcon() && (
                    <Footer />
                )}
            </div>
        </>
    );
}
