import PopUp from "@/shared/Dialog";
import { IonIcon } from "@ionic/react";
import { closeOutline, qrCodeOutline, shareOutline } from "ionicons/icons";
import QRScanner from "../Scanner/Scanner";
import { useState } from "react";

interface CreateActionSheetProps {
    onAddPost: () => void;
}

export const CreateActionSheet: React.FC<CreateActionSheetProps> = ({ onAddPost }) => {
    const [isScanning, setIsScanning] = useState(false);

    return (
        <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id="actionSheetCreate" style={{
            visibility: 'visible',
        }} aria-modal="true" role="dialog">
            <PopUp
                isOpen={isScanning} onClose={() => setIsScanning(false)}>
                <QRScanner />
            </PopUp>
            <div className="offcanvas-body">
                <ul className="action-button-list">
                    <li>
                        <button className="btn btn-list" data-bs-dismiss="offcanvas" onClick={onAddPost}>
                            <span>
                                <IonIcon icon={shareOutline} role="img" className="md hydrated" aria-label="share outline" />
                                Add Post
                            </span>
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-list" data-bs-dismiss="offcanvas" onClick={() => {
                            setIsScanning(true);
                        }}>
                            <span>
                                <IonIcon icon={qrCodeOutline} role="img" className="md hydrated" aria-label="share outline" />
                                Scan QR Code
                            </span>
                        </button>
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