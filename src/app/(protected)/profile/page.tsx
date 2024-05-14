'use client';
import clsx from "clsx";

import { NoAuthWall } from "@/components/Protected/NoAuthWall";
import QRScanner from "@/components/Scanner/Scanner";
import PopUp from "@/shared/Dialog";

import { useUser } from "@/hooks/useUser";
import { useState } from "react";

const ScannerButton: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);

    return (
        <>
            <PopUp
                isOpen={isScanning} onClose={() => setIsScanning(false)}>
                <QRScanner />
            </PopUp>
            <button
                onClick={() => setIsScanning(true)}
                className={clsx(
                    "flex items-center justify-center text-xs max-w-fit px-3 py-1 rounded-md gap-2 w-full",
                    "bg-theme-primary px-4 py-2 text-sm font-medium text-white hover:bg-theme-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2"
                )}>
                <i className="fas fa-camera text-lg"></i>
                Link QR Code
            </button>
        </>

    );
};

const Page = () => {
    const { isLoggedIn } = useUser();

    if (!isLoggedIn) {
        return <NoAuthWall redirectTo="/profile" />;
    }

    return (
        <div className="relative">
            <h1>Profile Page</h1>
            <ScannerButton />
        </div>
    );
};

export default Page;