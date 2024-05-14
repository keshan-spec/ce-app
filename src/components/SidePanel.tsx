import { handleSignOut } from "@/actions/auth-actions";
import { useUser } from "@/hooks/useUser";
import { ThemeBtn } from "@/shared/ThemeBtn";
import Link from "next/link";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { IonIcon } from '@ionic/react';
import { cubeOutline, homeOutline } from "ionicons/icons";

export const SidePanel: React.FC = () => {
    const { isLoggedIn, user } = useUser();

    return (
        <div className="offcanvas offcanvas-start" tabIndex={-1} id="sidebarPanel">
            <div className="offcanvas-body">
                <div className="profileBox">
                    <div className="image-wrapper">
                        <img src={user?.profile_image} alt="image" className="imaged rounded" />
                    </div>
                    <div className="in"> <strong>
                        {user?.first_name} {user?.last_name}
                    </strong>
                        <div className="text-muted">
                            @{user?.username}
                        </div>
                    </div>
                    <a href="#" className="close-sidebar-button" data-bs-dismiss="offcanvas">
                        <IonIcon name="close" />
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

            </div>
            <div className="sidebar-buttons">
                {isLoggedIn && (
                    <ThemeBtn
                        className="w-full"
                        onClick={() => {
                            handleSignOut();
                        }}
                        icon="fas fa-sign-out-alt"
                    >
                        Sign Out
                    </ThemeBtn>
                )}

                {!isLoggedIn && (
                    <Link className="w-full" href="/auth/login">
                        <ThemeBtn className="w-full">
                            Sign In <BiLogInCircle className="ml-2" />
                        </ThemeBtn>
                    </Link>
                )}
            </div>
        </div>
    );
};