"use client";
import { useState } from 'react';

// Scanner library
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { verifyScan } from '@/actions/qr-actions';
import { Loader } from '../Loader';
import { ScanResponse } from '@/types/qr-code';
import dynamic from 'next/dynamic';

const ScanResult = dynamic(() => import('@/components/Scanner/ScanResult'), { ssr: false });
const Html5QRScanner = dynamic(() => import('@/components/Scanner/Html5QRScanner'), { ssr: false });

interface QRScannerProps {
}

const QRScanner: React.FC<QRScannerProps> = ({ }) => {
    const [result, setResult] = useState<ScanResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onScanSuccess = async (decodedText: string) => {
        // https://mydrivelife.com/qr/clpmhHGEXyUD
        // get the qr code and verify it
        console.log('decodedText', decodedText);

        try {
            const url = new URL(decodedText);
            if (url.hostname === 'mydrivelife.com') {
                const qrCode = url.pathname.split('/').pop();
                if (qrCode) {
                    setLoading(true);
                    const response = await verifyScan(qrCode);
                    setLoading(false);
                    setResult(response);
                }
            } else {
                throw new Error('Invalid QR Code');
            }
        } catch (error) {
            console.log('error', error);
            setResult({
                available: false,
                message: 'Invalid QR Code',
                qr_code: decodedText,
                status: 'error'
            });
        }
    };

    const handleError = (errorMessage: string, error: Html5QrcodeError) => {
        // console.log('handleError', errorMessage, error);
    };

    return (
        <>
            {loading && <Loader />}
            {!result && (
                <Html5QRScanner
                    onScanSuccess={onScanSuccess}
                    handleError={handleError}
                    startScanning={true}
                />
            )}
            <ScanResult result={result} callback={setResult} />
        </>
    );
};

export default QRScanner;