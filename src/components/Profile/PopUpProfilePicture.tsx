import React from 'react';
interface PopUpProfilePictureProps {
    image: string;
}
export const PopUpProfilePicture: React.FC<PopUpProfilePictureProps> = ({
    image
}) => {
    return (
        <>
            <img src={image} alt="avatar" className="profile-image object-cover" data-bs-toggle="modal" data-bs-target="#DialogImage" />
            <div className="modal fade dialogbox" id="DialogImage" data-bs-backdrop="static" tabIndex={-1} role="dialog" aria-modal="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content !rounded-full">
                        <img src={image} alt="Profile Picture" className="rounded-full object-cover" data-bs-dismiss="modal" />
                    </div>
                </div>
            </div>
        </>
    );
};