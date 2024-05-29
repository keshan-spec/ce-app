import { closeCircleOutline, createOutline, ellipsisVerticalOutline, settingsOutline, trashBinOutline, warningOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { deletePost } from "@/actions/post-actions";

interface PostActionsProps {
    postId: number;
    isOwner: boolean;
    onDeleted?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
    isOwner,
    postId,
    onDeleted
}) => {
    const handleReport = () => { };

    const handleDelete = async () => {
        if (!isOwner) return;
        try {
            if (confirm("Are you sure you want to delete this post?")) {
                const response = await deletePost(postId);

                if (response) {
                    onDeleted && onDeleted();
                } else {
                    throw new Error("Failed to delete post");
                }
            }
        } catch (error) {
            alert("Failed to delete post");
            console.log(error);
        }
    };

    return (
        <div className="dropdown">
            <button type="button" data-bs-toggle="dropdown" aria-expanded="true">
                <IonIcon icon={ellipsisVerticalOutline} />
            </button>
            <div className="dropdown-menu dropdown-menu-end px-3" style={{
                position: 'absolute',
                inset: '0px 0px auto auto',
                margin: '0px',
                transform: 'translate3d(-230px, 42px, 0px)',
                minWidth: 'unset'
            }} data-popper-placement="bottom-end">
                <button className="text-red-600 text-xs flex items-center justify-center" onClick={handleReport}>
                    <IonIcon icon={warningOutline} className="!w-4" /> Report
                </button>
                <div className="dropdown-divider"></div>
                <button className="text-red-600 text-xs flex items-center justify-center" onClick={handleDelete}>
                    <IonIcon icon={trashBinOutline} className="!w-4" /> Delete
                </button>
            </div>
        </div>
    );
};

export const PostActionsSheet: React.FC<PostActionsProps> = ({
    isOwner,
    postId,
    onDeleted
}) => {
    const handleReport = () => { };

    const handleDelete = async () => {
        if (!isOwner) return;
        try {
            if (confirm("Are you sure you want to delete this post?")) {
                const response = await deletePost(postId);

                if (response) {
                    onDeleted && onDeleted();
                } else {
                    throw new Error("Failed to delete post");
                }
            }
        } catch (error) {
            alert("Failed to delete post");
            console.log(error);
        }
    };

    return (
        <>
            <div className="media-post-edit" data-bs-toggle="offcanvas" data-bs-target={`#postSettings-${postId}`}>
                <IonIcon icon={settingsOutline} role="img" className="md hydrated" aria-label="settings outline" />
            </div>
            <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id={`postSettings-${postId}`}
                style={{
                    visibility: 'visible',
                }}
                aria-modal="true" role="dialog">
                <div className="offcanvas-body">
                    <ul className="action-button-list">
                        <li>
                            <button className="btn btn-list" data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={createOutline} role="img" className="md hydrated" aria-label="create outline" />
                                    Edit Post
                                </span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-list"
                                data-bs-dismiss="offcanvas"
                                onClick={handleDelete}
                            >
                                <span>
                                    <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" aria-label="close circle outline" />
                                    Delete Post
                                </span>
                            </button>
                        </li>
                        <li className="action-divider"></li>
                        <li>
                            <button className="btn btn-list text-danger" data-bs-dismiss="offcanvas">
                                <span>Close</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};