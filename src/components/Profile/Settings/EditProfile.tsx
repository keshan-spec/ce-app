'use client';
import { removeProfileImage, updateProfileImage } from '@/actions/profile-actions';
import { EditProfilePicture } from '@/components/ActionSheets/ProfilePicture';
import { useUser } from '@/hooks/useUser';
import { IonIcon } from '@ionic/react';
import { caretForwardOutline, closeCircle } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';

export const EditProfile: React.FC = () => {
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
            <div className="section full mt-1 mb-2">
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

                <div className="section-title">Profile</div>
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

            <div className="section full mt-2 mb-2">
                <div className="section-title">Username</div>
                <div className="wide-block pb-1 pt-1">
                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="name1">Username</label>
                            <input type="text" className="form-control" id="name1" placeholder="Enter desired username" value={user.username} />
                            <i className="clear-input">
                                <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                            </i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section full mt-2 mb-2">
                <div className="section-title">Your Details</div>
                <div className="wide-block pb-1 pt-1">
                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="name1">First Name</label>
                            <input type="text" className="form-control" id="name1" placeholder="Enter first name" value={user.first_name} />
                            <i className="clear-input">
                                <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                            </i>
                        </div>
                    </div>

                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="name1">Last Name</label>
                            <input type="text" className="form-control" id="name1" placeholder="Enter last name" value={user.last_name} />
                            <i className="clear-input">
                                <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                            </i>
                        </div>
                    </div>

                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label" htmlFor="email1">E-mail</label>
                            <input type="email" className="form-control" id="email1" placeholder="E-mail address" value={user.email} />
                            <i className="clear-input">
                                <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                            </i>
                        </div>
                    </div>

                </div>

            </div>

            <div className="section full mt-2 mb-5">
                <div className="section-title">Password</div>
                <div className="wide-block pb-1 pt-1">

                    <div className="change-pass-toggle">Change Password
                        <IonIcon icon={caretForwardOutline} role="img" className="md hydrated" aria-label="caret forward outline" />
                        <div className="mt-3 collapse-password-form">
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <input type="password" className="form-control" id="newPassword" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input type="password" className="form-control" id="confirmPassword" required />
                            </div>
                            <button type="submit" className="btn btn-primary mb-2">Reset Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};