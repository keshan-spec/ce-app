'use client';
import { removeProfileImage, updateProfileImage } from "@/actions/profile-actions";
import { EditProfilePicture } from "@/components/ActionSheets/ProfilePicture";
import { useUser } from "@/hooks/useUser";
import { useEffect, useRef, useState } from "react";

export const EditImages: React.FC = () => {
    const { user, isLoggedIn } = useUser();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const msgRef = useRef<HTMLDivElement>(null);

    const onRemoveImage = async () => {
        try {
            const response = await removeProfileImage();
            if (response.error) {
                throw new Error(response.error);
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'An error occurred while removing your profile image');
        }
    };

    const onUploadImage = async (image: File) => {
        try {
            // convert image to base64
            let base64: string = '';
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                base64 = reader.result as string;

                // upload image
                await updateProfileImage(base64);
            };
        } catch (error: any) {
            setErrorMessage(error.message || 'An error occurred while uploading your profile image');
        }
    };

    useEffect(() => {
        if (errorMessage) {
            msgRef.current?.classList.add('show');
            setTimeout(() => {
                setErrorMessage(null);
            }, 15000);
        } else {
            msgRef.current?.classList.remove('show');
        }
    }, [errorMessage]);

    if (!isLoggedIn || !user) return null;

    return (
        <>
            <div id="toast-16" ref={msgRef} className="toast-box toast-top bg-danger">
                <div className="in">
                    <div className="text">
                        {errorMessage}
                    </div>
                </div>
                <button type="button" className="btn btn-sm btn-text-light close-button" onClick={() => {
                    setErrorMessage(null);
                }}>OK</button>
            </div>

            <div className="section full mt-1 mb-2">
                <div className="section-title">Profile Image</div>
                <div className="wide-block pb-1 pt-1">
                    <ul className="listview image-listview no-line no-space flush">
                        <li>
                            <div className="item">
                                <EditProfilePicture
                                    user_id={user.id}
                                    profile_image={user.profile_image}
                                    onRemoveImage={onRemoveImage}
                                    onUploadImage={onUploadImage}
                                />
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
            <div className="section full mt-1 mb-2">
                <div className="section-title">Cover Image</div>
                <div className="wide-block pb-1 pt-1">

                    <ul className="listview image-listview no-line no-space flush">
                        <li>
                            <div className="item">
                                <img src="assets/img/sample/avatar/avatar1.jpg" alt="image" className="image" />
                                <div className="in">
                                    <a className="form-group basic">
                                        <span>Cover image</span>
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>

                </div>
            </div>
        </>
    );
};