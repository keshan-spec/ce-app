import { CreateActionSheet } from "@/components/ActionSheets/Create";
import { CreatePost } from "@/components/PostActions/CreatePost";
import SlideInFromBottomToTop from "@/shared/SlideIn";
import { IonIcon } from "@ionic/react";
import { homeOutline, searchOutline, carSport, idCardOutline, personCircleOutline, addOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Footer: React.FC = () => {
    const pathname = usePathname();
    const [isOpen, setOpen] = useState<boolean>(false);

    return (
        <>
            <SlideInFromBottomToTop isOpen={isOpen} onClose={() => setOpen(false)} fullScreen>
                <CreatePost
                    closePanel={() => {
                        setOpen(false);
                    }}
                />
            </SlideInFromBottomToTop>
            <div className="appBottomMenu">
                <Link href="/" className={`item ${pathname == '/' ? 'active' : ''}`}>
                    <div className="col">
                        <IonIcon icon={homeOutline} />
                        <strong>For You</strong>
                    </div>
                </Link>

                <Link href="/discover" className={`item ${pathname == '/discover' ? 'active' : ''}`}>
                    <div className="col">
                        <IonIcon icon={searchOutline} />
                        <strong>Discover</strong>
                    </div>
                </Link>

                <div className="fab-button animate dropdown">
                    <span className="fab -mt-6" data-bs-toggle="offcanvas" data-bs-target="#actionSheetCreate">
                        <IonIcon icon={addOutline} role="img" className="md hydrated" aria-label="add outline" />
                    </span>
                    <CreateActionSheet onAddPost={() => setOpen(true)} />
                </div>

                <Link href="/posts" className={`item ${pathname.includes('/posts') ? 'active' : ''}`}>
                    <div className="col">
                        <IonIcon icon={idCardOutline} />
                        <strong>Social</strong>
                    </div>
                </Link>

                <Link href="/profile" className={`item ${pathname.includes('/profile') ? 'active' : ''}`}>
                    <div className="col flex items-center flex-col ">
                        <img src="/assets/img/icon/f-profile7.svg" alt="profile" className="w-6 h-6" />
                        <strong>Profile</strong>
                    </div>
                </Link>
            </div>
        </>
    );
};