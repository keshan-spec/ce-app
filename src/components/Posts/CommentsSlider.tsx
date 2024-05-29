import { IonIcon } from "@ionic/react";
import { ComentsSection } from "./ComentSection";
import { closeOutline } from "ionicons/icons";

interface CommentsSliderProps {
    postId: number;
    commentCount: number;
}


export const CommentsSlider: React.FC<CommentsSliderProps> = ({
    postId,
    commentCount,
}) => {
    return (
        <div className="offcanvas offcanvas-bottom offcanvas-large action-sheet" tabIndex={-1} id="postComments" style={{
            visibility: "visible",
        }} aria-modal="true" role="dialog">
            <div className="offcanvas-body">
                <div className="comments-container">
                    <div className="comments-container-header" data-bs-dismiss="offcanvas">
                        <IonIcon icon={closeOutline} role="img" className="md hydrated" aria-label="close outline" /> <span>{commentCount} Comments</span>
                    </div>

                    <div className="comment-block">
                        <ComentsSection postId={postId} />
                    </div>
                </div>
            </div>
        </div>
    );
};