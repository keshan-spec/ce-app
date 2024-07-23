import { handleSignOut } from "@/actions/auth-actions";
import { useUser } from "@/hooks/useUser";
import { ThemeBtn } from "@/shared/ThemeBtn";
import Link from "next/link";
import { IonIcon } from '@ionic/react';
import { close, cubeOutline, homeOutline } from "ionicons/icons";
import { useState } from "react";
import { Loader } from "./Loader";
import { PLACEHOLDER_PFP, sendRNMessage } from "@/utils/nativeFeel";

export const SidePanel: React.FC = () => {
    const { isLoggedIn, user } = useUser();

    const [loading, setLoading] = useState(false);

    const onSignout = async () => {
        setLoading(true);
        sendRNMessage({
            type: 'signOut',
            user_id: user?.id
        });
        await handleSignOut();
    };

    return (
        <div className="offcanvas offcanvas-start" tabIndex={-1} id="sidebarPanel">
            {loading && <Loader transulcent />}
            <div className="offcanvas-body">
                <div className="profileBox">
                    <div className="image-wrapper">
                        <img src={user?.profile_image || PLACEHOLDER_PFP} alt="image" className="imaged rounded" />
                    </div>
                    <div className="in"> <strong>
                        {user?.first_name} {user?.last_name}
                    </strong>
                        <div className="text-muted">
                            @{user?.username}
                        </div>
                    </div>
                    <a href="#" className="close-sidebar-button" data-bs-dismiss="offcanvas">
                        <IonIcon icon={close} />
                    </a>
                </div>

                <ul className="listview flush transparent no-line image-listview mt-2">
                    <li>
                        <Link href="/" className="item">
                            <div className="icon-box bg-primary">
                                <IonIcon icon={homeOutline} />
                            </div>
                            <div className="in"> Home </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile" className="item">
                            <div className="icon-box bg-primary">
                                <IonIcon icon={cubeOutline} />
                            </div>
                            <div className="in"> Profile </div>
                        </Link>
                    </li>
                </ul>

                <div className="text-center mt-2 w-full">
                    <a href="#" onClick={() => window.location.reload()} className="btn btn-primary w-3/4">Reload App</a>
                </div>
            </div>
            <div className="sidebar-buttons">
                {isLoggedIn && (
                    <ThemeBtn
                        className="w-full"
                        onClick={onSignout}
                        icon="fas fa-sign-out-alt"
                    >
                        Sign Out
                    </ThemeBtn>
                )}

                {!isLoggedIn && (
                    <Link className="w-full" href="/auth/login">
                        <ThemeBtn
                            className="w-full"
                            icon="fas fa-sign-in-alt"
                        >
                            Sign In
                        </ThemeBtn>
                    </Link>
                )}
            </div>
        </div>
    );
};