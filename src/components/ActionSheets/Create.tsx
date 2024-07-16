import { IonIcon } from "@ionic/react";
import { addCircleOutline, carSportOutline, closeOutline } from "ionicons/icons";
import Link from "next/link";

interface CreateActionSheetProps {
    onAddPost: () => void;
}

export const CreateActionSheet: React.FC<CreateActionSheetProps> = ({ onAddPost }) => {

    return (
        <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id="actionSheetCreate" style={{
            visibility: 'visible',
        }} aria-modal="true" role="dialog">

            <div className="offcanvas-body">
                <ul className="action-button-list">
                    <li>
                        <button className="btn btn-list" data-bs-dismiss="offcanvas" onClick={onAddPost}>
                            <span>
                                <IonIcon icon={addCircleOutline} role="img" className="md hydrated" aria-label="share outline" />
                                Add Post
                            </span>
                        </button>
                    </li>
                    <li>
                        <Link href={'/garage/add'} className="btn btn-list" data-bs-dismiss="offcanvas" >
                            <span>
                                <IonIcon icon={carSportOutline} role="img" className="md hydrated" aria-label="share outline" />
                                Add Vehicle
                            </span>
                        </Link>
                    </li>
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
    );
};