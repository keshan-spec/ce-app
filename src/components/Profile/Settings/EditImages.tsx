'use client';
import { removeProfileImage, updateCoverImage, updateProfileImage } from "@/actions/profile-actions";
import { EditProfilePicture } from "@/components/ActionSheets/ProfilePicture";
import { Loader } from "@/components/Loader";
import { useUser } from "@/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import { memo, useRef, useState } from "react";

interface ImageUploadResponse {
    success: boolean;
    image_url?: string;
    error?: string;
}

const EditImages = () => {
    const { user, isLoggedIn } = useUser();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const msgRef = useRef<HTMLDivElement>(null);

    const removeImageMutation = useMutation({
        mutationFn: async (type: 'profile' | 'cover') => {
            const apiFunc = type === 'profile' ? removeProfileImage : removeProfileImage;
            const response = await apiFunc();
            if (response.error) {
                throw new Error(response.error);
            }
            return response;
        },
        onError: (error: any, variables, context) => {
            setErrorMessage(error.message || `An error occurred while removing your ${variables} image`);
        }
    });

    const uploadImageMutation = useMutation({
        mutationFn: async ({ image, type }: { image: File, type: 'profile' | 'cover'; }) => {
            const apiFunc = type === 'profile' ? updateProfileImage : updateCoverImage;

            let base64: string = '';
            const reader = new FileReader();
            reader.readAsDataURL(image);

            return new Promise<ImageUploadResponse>((resolve, reject) => {
                reader.onload = async () => {
                    base64 = reader.result as string;
                    try {
                        const response = await apiFunc(base64);
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => {
                    reject(new Error('Failed to read file'));
                };
            });
        },
        onError: (error: any, variables, context) => {
            setErrorMessage(error.message || `An error occurred while uploading your ${variables.type} image`);
        },
        onSuccess: (data, variables, context) => {
            console.log(data, variables, context);
            if (!data.image_url) return;

            if (variables.type === 'profile') {
                user.profile_image = data.image_url;
            } else {
                user.cover_image = data.image_url;
            }
        }
    });

    const onRemoveImage = (type: 'profile' | 'cover') => {
        removeImageMutation.mutate(type);
    };

    const onUploadImage = (image: File, type: 'profile' | 'cover') => {
        uploadImageMutation.mutate({ image, type });
    };

    if (!isLoggedIn || !user) return null;

    return (
        <>
            {removeImageMutation.isPending || uploadImageMutation.isPending && <Loader transulcent />}
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
                            <div className="item w-full">
                                <EditProfilePicture
                                    type="profile"
                                    user_id={user.id}
                                    profile_image={user.profile_image}
                                    onRemoveImage={onRemoveImage}
                                    onUploadImage={onUploadImage}
                                // isLoading={removeImageMutation.isPending || uploadImageMutation.isPending}
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
                                <EditProfilePicture
                                    type="cover"
                                    user_id={user.id}
                                    profile_image={user.cover_image}
                                    onRemoveImage={onRemoveImage}
                                    onUploadImage={onUploadImage}
                                // isLoading={removeImageMutation.isPending || uploadImageMutation.isPending}
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default memo(EditImages);