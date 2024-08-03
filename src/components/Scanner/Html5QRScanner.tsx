import { CameraDevice, Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const ThemeBtn = dynamic(() => import('@/shared/ThemeBtn'), { ssr: false });

interface Html5QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    handleError?: (errorMessage: string, error: Html5QrcodeError) => void;
    startScanning?: boolean;
    allowFileScan?: boolean;
}

const qrcodeRegionId = "reader";
let defaultConfig: Html5QrcodeScannerConfig = {
    qrbox: { width: 250, height: 250 },
    fps: 60,
    showTorchButtonIfSupported: true,
    showZoomSliderIfSupported: true,
    // aspectRatio: 1.7777778
};
let html5QrCode: Html5Qrcode | undefined;

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props?: Html5QrcodeScannerConfig): Html5QrcodeScannerConfig => {
    let config: Html5QrcodeScannerConfig = defaultConfig;

    if (!props) {
        return config;
    }

    if (props.fps) {
        config.fps = props.fps;
    }

    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }

    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }

    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }

    return config;
};

const Html5QRScanner: React.FC<Html5QRScannerProps> = ({
    onScanSuccess,
    handleError,
    startScanning = false,
    allowFileScan = false
}) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const [cameraList, setCameraList] = useState<CameraDevice[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [activeCamera, setActiveCamera] = useState<CameraDevice>();

    useEffect(() => {
        if (html5QrCode === undefined) {
            html5QrCode = new Html5Qrcode(qrcodeRegionId);
            getCameras();
            const oldRegion = document.getElementById("qr-shaded-region");
            oldRegion && oldRegion.remove();

            if (startScanning) {
                handleClickAdvanced();
            }
        }

        return () => {
            handleStop();
        };
    }, []);

    const qrCodeSuccessCallback = (decodedText: string) => {
        handleStop();
        onScanSuccess(decodedText);
    };

    const handleClickAdvanced = () => {
        if (isScanning) return;

        try {
            const config = createConfig();
            setIsScanning(true);
            html5QrCode?.start(
                { facingMode: "environment" },
                // @ts-ignore
                config,
                qrCodeSuccessCallback,
                handleError
            ).then(() => {
                // const oldRegion = document.getElementById("qr-shaded-region");
                // if (oldRegion) oldRegion.innerHTML = "";
            });
        } catch (err) {
            console.error(err);
            alert(`Error starting scanner ${JSON.stringify(err)}`);
            setIsScanning(false);
        }
    };

    const getCameras = () => {
        return;

        Html5Qrcode.getCameras()
            .then((devices) => {
                /**
                 * devices would be an array of objects of type:
                 * { id: "id", label: "label" }
                 */
                if (devices && devices.length) {
                    setCameraList(devices);
                    setActiveCamera(devices[0]);
                }
            })
            .catch((err) => {
                console.error(err);
                setCameraList([]);
            });
    };

    const _onCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.selectedIndex) {
            let selectedCamera = e.target.options[e.target.selectedIndex];
            let cameraId = selectedCamera.dataset.key;
            setActiveCamera(cameraList.find((cam) => cam.id === cameraId));
        }
    };

    const handleStop = () => {
        setIsScanning(false);
        try {
            const state = Html5QrcodeScannerState[html5QrCode?.getState()!];
            if (state === Html5QrcodeScannerState.NOT_STARTED.toString() || state === Html5QrcodeScannerState.UNKNOWN.toString()) {
                console.log("Scanner not started yet");
                return;
            }

            html5QrCode?.stop()
                .then((res) => {
                    html5QrCode?.clear();
                })
                .catch((err) => {
                    console.log(err.message);
                });

            html5QrCode = undefined;
        } catch (err: any) {
            console.error(err);
        }
    };

    const scanLocalFile = () => {
        handleStop();

        if (!fileRef.current) return;
        fileRef.current.click();
    };

    const scanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        if (e.target.files.length === 0) {
            // No file selected, ignore
            return;
        }

        // Use the first item in the list
        const imageFile = e.target.files[0];

        html5QrCode?.scanFile(imageFile, /* showImage= */ true)
            .then((qrCodeMessage) => {
                onScanSuccess(qrCodeMessage);
                handleStop();
                html5QrCode?.clear();
            })
            .catch((err) => {
                // failure, handle it.
                console.log(`Error scanning file. Reason: ${err}`);
            });
    };

    return (
        <div className="w-full h-full">
            <div id={qrcodeRegionId} className="w-full text-black flex items-center justify-start bg-gray-200">
                <div className="p-4 bg-white rounded-lg shadow-lg">
                    <svg className="animate-spin h-12 w-12 text-gray-600 mx-auto" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0112 4V0C6.486 0 2 4.486 2 10h4zm6 6.627A8 8 0 0014 20v4c5.627 0 10-4.473 10-10h-4zm-6 5.373A8 8 0 004 12h-4c0 5.627 4.473 10 10 10v-4z"></path>
                    </svg>
                    <div className="mt-4 text-center">Initializing Scanner...</div>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                {!isScanning && !startScanning && (
                    <ThemeBtn onClick={handleClickAdvanced}>Start Scanning</ThemeBtn>
                )}
                {allowFileScan && (
                    <>
                        <div className='flex justify-between px-3 py-4 w-full'>
                            {allowFileScan && (
                                <ThemeBtn onClick={scanLocalFile}>
                                    Scan File
                                </ThemeBtn>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileRef}
                            onChange={scanFile}
                            style={{ display: "none" }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Html5QRScanner;