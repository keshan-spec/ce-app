"use client";
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
import { IonIcon } from '@ionic/react';
import { closeOutline, cloudUpload, removeCircle } from 'ionicons/icons';

interface EditProfilePictureProps {
    user_id: string;
    profile_image: string | null;
    onRemoveImage: () => void;
    onUploadImage: (image: File) => void;
}

export const EditProfilePicture: React.FC<EditProfilePictureProps> = ({
    user_id,
    profile_image,
    onRemoveImage,
    onUploadImage,
}) => {
    return (
        <div className="fab-button animate dropdown">
            <span data-bs-toggle="offcanvas" data-bs-target={`#actionSheetCreate_${user_id}`} className='flex'>
                <img src={profile_image || PLACEHOLDER_PFP} alt="image" className="image" />
                <div className="in">
                    <a className="form-group basic">
                        Profile image
                    </a>
                </div>
            </span>
            <input type="file" accept="image/*" className="d-none" id={`file_${user_id}`} onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                onUploadImage && onUploadImage(file);
            }} />
            <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id={`actionSheetCreate_${user_id}`} style={{
                visibility: 'visible',
            }} aria-modal="true" role="dialog">
                <div className="offcanvas-body">
                    <ul className="action-button-list">
                        <li>
                            <button className="btn btn-list" data-bs-dismiss="offcanvas"
                                onClick={() => {
                                    document.getElementById(`file_${user_id}`)?.click();
                                }}>
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
                                        onRemoveImage();
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
        </div>
    );
};
