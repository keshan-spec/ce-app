'use client';
import { redirect, useSearchParams } from "next/navigation";
import PopUp from "./Dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GeneralErrorPopUp: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [hasError, setError] = useState<boolean>(!!searchParams.get('error') || !!searchParams.get('deeplink'));

    const getErrorMessage = () => {
        const error = searchParams.get('error');

        if (error === 'invalid-qr') {
            return (
                <div className="text-center">
                    <h4>Invalid QR Code</h4>
                    <p>The QR code you scanned is invalid.</p>
                </div>
            );
        } else if (error === 'invalid-link') {
            return (
                <div className="text-center">
                    <h4>Invalid Link</h4>
                    <p>The link you tried to access is invalid.</p>
                </div>
            );
        }

        if (searchParams.get('deeplink')) {
            const deepLink = searchParams.get('deeplink');

            if (!deepLink) {
                return (
                    <div className="text-center">
                        <h4>Invalid Link</h4>
                        <p>The link you tried to access is invalid.</p>
                    </div>
                );
            }

            // parse url
            const url = new URL(deepLink);
            const path = url.pathname;

            return redirect(path);
        }

        return (
            <div className="text-center">
                <h4>Oops!</h4>
                <p>Something went wrong. Please try again later.</p>
            </div>
        );
    };

    const onClose = () => {
        setError(false);
        router.push('/');
    };

    return (
        <PopUp isOpen={hasError} title="Error" onClose={onClose}>
            <div className="px-4">
                {getErrorMessage()}
            </div>
        </PopUp>
    );
};

export default GeneralErrorPopUp;