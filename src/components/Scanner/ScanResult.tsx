import { linkProfile } from "@/actions/qr-actions";
import { useUser } from "@/hooks/useUser";
import { ScanResponse } from "@/types/qr-code";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ThemeBtn = dynamic(() => import('@/shared/ThemeBtn'), { ssr: false });


interface ScanResultProps {
    result: ScanResponse | null;
    callback: (result: null) => void;
}

const ScanResult: React.FC<ScanResultProps> = ({
    result,
    callback
}) => {
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error' | 'info' | 'warning';
        text: string;
    } | null>(null);

    useEffect(() => {
        return () => {
            setLoading(false);
            setMessage(null);
        };
    }, []);

    const handleUnlink = async () => {
        // TODO: Implement unlinking of profile
        setMessage({
            type: 'info',
            text: 'Unlinking of profile is not yet implemented'
        });
    };

    const handleLink = async () => {
        if (!result) {
            return;
        }

        try {
            setLoading(true);
            setMessage(null);

            const response = await linkProfile(result?.qr_code);

            if (response.status === 'error') {
                setMessage({
                    type: 'error',
                    text: response.message
                });
            } else {
                setMessage({
                    type: 'success',
                    text: response.message
                });
            }

            setLoading(false);
        } catch (e) {
            console.error("Error linking profile", e);
            setLoading(false);
            setMessage({
                type: 'error',
                text: 'Error linking profile'
            });
        }
    };

    const handleScanAgain = () => {
        setMessage(null);
        callback(null);
    };

    const renderResult = () => {
        if (!result || result.status === 'error') {
            return <h2 className="text-center">Sorry, this QR code is not valid</h2>;
        }

        if (result.available) {
            return (
                <>
                    <h2 className="text-center">Congrats! This QR code is up for grabs</h2>
                    <ThemeBtn
                        onClick={handleLink}
                        loading={loading}>
                        Link Profile
                    </ThemeBtn>
                </>
            );
        }

        if (!result.available) {
            return (
                <>
                    <h2 className="text-center">Sorry, this QR code is already linked</h2>
                    {result.data && result.data.linked_to == user?.id && (
                        <ThemeBtn
                            onClick={handleUnlink}
                            loading={loading}
                            icon="fas fa-unlink"
                        >
                            Unlink Profile
                        </ThemeBtn>
                    )}
                </>
            );
        }
    };

    const getMessageClass = () => {
        if (!message) {
            return '';
        }

        switch (message.type) {
            case 'success':
                return 'text-green-500 bg-green-100';
            case 'error':
                return 'text-red-500 bg-red-100';
            case 'info':
                return 'text-blue-500 bg-blue-100';
            case 'warning':
                return 'text-yellow-500 bg-yellow-100';
            default:
                return '';
        }
    };

    return <>
        {result && (
            <div className="p-2 flex flex-col items-center">
                {renderResult()}
                <button
                    className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-theme-primary px-4 py-2 text-sm font-medium text-white hover:bg-theme-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2"
                    onClick={handleScanAgain}>
                    Scan Again
                </button>
            </div>
        )}

        {message && (
            <div className={`p-2 mt-2 text-center ${getMessageClass()}`}>
                {message.text}
            </div>
        )}
    </>;
};

export default ScanResult;