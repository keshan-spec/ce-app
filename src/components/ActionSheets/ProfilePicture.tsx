"use client";
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
// import { IonIcon } from '@ionic/react';
// import clsx from 'clsx';
// import { closeOutline, cloudUpload, removeCircle } from 'ionicons/icons';

// import ReactCrop from 'react-image-crop'

// interface EditProfilePictureProps {
//     user_id: string;
//     profile_image: string | null;
//     onRemoveImage: (type: 'profile' | 'cover') => void;
//     onUploadImage: (image: File, type: 'profile' | 'cover') => void;
//     type: 'profile' | 'cover';
// }

// export const EditProfilePicture: React.FC<EditProfilePictureProps> = ({
//     user_id,
//     profile_image,
//     onRemoveImage,
//     onUploadImage,
//     type,
// }) => {
//     return (
//         <div className="fab-button animate dropdown">
//             <span data-bs-toggle="offcanvas" data-bs-target={`#actionSheetCreate_${user_id}_${type}`} className={clsx(
//                 'flex',
//                 type === 'cover' && 'flex-col'
//             )}>
//                 <img src={profile_image || PLACEHOLDER_PFP} alt="image" className={clsx(
//                     type === 'profile' ? "image" : 'cover-image'
//                 )} />
//                 <div className="in">
//                     <a className="form-group basic">
//                         {type === 'profile' ? 'Profile' : 'Cover'} Picture
//                     </a>
//                 </div>
//             </span>
//             <input type="file" accept="image/*" className="d-none" id={`file_${user_id}_${type}`} onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (!file) return;
//                 onUploadImage && onUploadImage(file, type);
//             }} />
//             <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id={`actionSheetCreate_${user_id}_${type}`} style={{
//                 visibility: 'visible',
//             }} aria-modal="true" role="dialog">
//                 <div className="offcanvas-body">
//                     <ul className="action-button-list">
//                         <li>
//                             <button className="btn btn-list" data-bs-dismiss="offcanvas"
//                                 onClick={() => {
//                                     document.getElementById(`file_${user_id}_${type}`)?.click();
//                                 }}>
//                                 <span>
//                                     <IonIcon icon={cloudUpload} role="img" className="md hydrated" aria-label="cloud upload" />
//                                     Upload {profile_image && 'New '}Image
//                                 </span>
//                             </button>
//                         </li>

//                         {profile_image && (
//                             <li>
//                                 <button className="btn btn-list" data-bs-dismiss="offcanvas" onClick={() => {
//                                     if (confirm("Are you sure you want to remove your profile picture?")) {
//                                         onRemoveImage(type);
//                                     }
//                                 }}>
//                                     <span>
//                                         <IonIcon icon={removeCircle} role="img" className="md hydrated" aria-label="remove circle" />
//                                         Remove Image
//                                     </span>
//                                 </button>
//                             </li>
//                         )}

//                         <li className="action-divider"></li>
//                         <li>
//                             <button className="btn btn-list text-danger" data-bs-dismiss="offcanvas">
//                                 <span>
//                                     <IonIcon icon={closeOutline} role="img" className="md hydrated" aria-label="close outline" />
//                                     Close
//                                 </span>
//                             </button>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };


import React, { useState, useRef, useCallback } from 'react';
import { IonIcon } from '@ionic/react';
import { cloudUpload, removeCircle, closeOutline } from 'ionicons/icons';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from '@/shared/Modal';
import clsx from 'clsx';

interface EditProfilePictureProps {
    user_id: string;
    profile_image: string | null;
    onRemoveImage: (type: 'profile' | 'cover') => void;
    onUploadImage: (image: File, type: 'profile' | 'cover') => void;
    type: 'profile' | 'cover';
}

export const EditProfilePicture: React.FC<EditProfilePictureProps> = ({
    user_id,
    profile_image,
    onRemoveImage,
    onUploadImage,
    type,
}) => {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25,
    });

    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setSelectedImage(reader.result as string));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = useCallback((img: HTMLImageElement) => {
        imgRef.current = img;
    }, []);

    const getCroppedImg = () => {
        if (!completedCrop || !imgRef.current) {
            return;
        }

        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
        // Increase the canvas resolution by setting higher dimensions
        const canvasWidth = completedCrop.width! * 2;
        const canvasHeight = completedCrop.height! * 2;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                imgRef.current,
                completedCrop.x! * scaleX,
                completedCrop.y! * scaleY,
                completedCrop.width! * scaleX,
                completedCrop.height! * scaleY,
                0,
                0,
                canvasWidth,
                canvasHeight
            );
        }

        return new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 1); // Set the quality parameter to 1 (highest quality)
        });
    };

    const onConfirmCrop = async () => {
        const croppedImgBlob = await getCroppedImg();
        if (croppedImgBlob) {
            const croppedFile = new File([croppedImgBlob], 'cropped.jpg', { type: 'image/jpeg' });
            onUploadImage(croppedFile, type);
            setSelectedImage(null); // Clear the selected image after cropping
        }
    };


    return (
        <div className="fab-button animate dropdown w-full">
            <span data-bs-toggle="offcanvas" data-bs-target={`#actionSheetCreate_${user_id}_${type}`}
                className={clsx(
                    'flex',
                    type === 'cover' && 'flex-col w-full'
                )}
            >
                <img src={profile_image || PLACEHOLDER_PFP} alt="image" className={type === 'profile' ? 'image' : 'w-full'} />
                {type === 'profile' && (
                    <div className="in">
                        <a className="form-group basic">Profile Picture</a>
                    </div>
                )}
            </span>
            <input
                type="file"
                accept="image/*"
                className="d-none"
                id={`file_${user_id}_${type}`}
                ref={fileInputRef}
                onChange={onSelectFile}
            />
            <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id={`actionSheetCreate_${user_id}_${type}`} style={{ visibility: 'visible' }} aria-modal="true" role="dialog">
                <div className="offcanvas-body">
                    <ul className="action-button-list">
                        <li>
                            <button
                                className="btn btn-list"
                                data-bs-dismiss="offcanvas"
                                onClick={() => {
                                    fileInputRef.current?.click();
                                }}
                            >
                                <span>
                                    <IonIcon icon={cloudUpload} role="img" className="md hydrated" aria-label="cloud upload" />
                                    Upload {profile_image && 'New '}Image
                                </span>
                            </button>
                        </li>

                        {profile_image && (
                            <li>
                                <button className="btn btn-list" data-bs-dismiss="offcanvas" onClick={() => {
                                    if (confirm("Are you sure you want to remove your profile picture?")) {
                                        onRemoveImage(type);
                                    }
                                }}>
                                    <span>
                                        <IonIcon icon={removeCircle} role="img" className="md hydrated" aria-label="remove circle" />
                                        Remove Image
                                    </span>
                                </button>
                            </li>
                        )}

                        <li className="action-divider"></li>
                        <li>
                            <button className="btn btn-list text-danger" data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={closeOutline} role="img" className="md hydrated" aria-label="close outline" />
                                    Close
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
                {selectedImage && (
                    <div className="crop-container">
                        <ReactCrop
                            circularCrop={type === 'profile'}
                            crop={crop}
                            ruleOfThirds
                            aspect={type === 'profile' ? 1 : 16 / 9}
                            onChange={(newCrop) => setCrop(newCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                        >
                            <img src={selectedImage} alt="Crop" className="m-auto" onLoad={(e) => onLoad(e.currentTarget)} />
                        </ReactCrop>
                        <div className="flex items-center justify-between px-2">
                            <button onClick={onConfirmCrop} className="btn btn-primary mt-2">Upload</button>
                            <button onClick={() => setSelectedImage(null)} className="btn btn-secondary mt-2">Cancel</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
