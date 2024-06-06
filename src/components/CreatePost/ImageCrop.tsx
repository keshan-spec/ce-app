"use client";
import { Button } from "@/shared/Button";
import { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

const ImageCropModal: React.FC<{ image: string, onCrop: (croppedImage: Area) => void; }> = ({ image, onCrop }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 });

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    };

    const handeConfirm = () => {
        // handle crop
        onCrop(croppedArea);
    };

    return (
        <div className="h-full w-full min-h-[70dvh]">
            <Cropper
                image={image}
                crop={crop}
                // aspect instagram like 1:1
                aspect={1 / 1}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />

            <Button
                className='absolute bottom-0 left-0'
                onClick={handeConfirm}>
                Confirm
            </Button>
        </div>
    );
};

export default ImageCropModal;