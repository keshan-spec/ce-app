import { closeCircleOutline, createOutline, settingsOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { deletePost } from "@/actions/post-actions";
import Link from "next/link";

interface PostActionsProps {
    postId: number;
    isOwner: boolean;
    onDeleted?: () => void;
    onDeleteStart?: () => void;
}

export const PostActionsSheet: React.FC<PostActionsProps> = ({
    isOwner,
    postId,
    onDeleted,
    onDeleteStart
}) => {
    const handleReport = () => { };

    const handleDelete = async () => {
        if (!isOwner) return;
        try {
            if (confirm("Are you sure you want to delete this post?")) {
                onDeleteStart?.();

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
                            <Link prefetch={false} href={`/edit-post/${postId}`} className="btn btn-list">
                                <span>
                                    <IonIcon icon={createOutline} role="img" className="md hydrated" aria-label="create outline" />
                                    Edit Post
                                </span>
                            </Link>
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