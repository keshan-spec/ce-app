'use client';
import { CreateActionSheet } from "@/components/ActionSheets/Create";
import { useUser } from "@/hooks/useUser";
import { sendRNMessage } from "@/utils/nativeFeel";
import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import { homeOutline, searchOutline, addOutline, cartOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

const Footer = () => {
    const pathname = usePathname();
    const { user } = useUser();

    const onAddPost = () => {
        if (!user) return;

        sendRNMessage({
            type: "createPost",
            user_id: user.id,
            page: pathname,
        });
    };

    return (
        <>
            <div className={clsx(
                "appBottomMenu",
            )}>
                <Link prefetch={true} href="/" className={`item ${pathname == '/' ? 'active' : ''}`} onClick={() => {
                    pathname == '/' && window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                    <div className="col">
                        <IonIcon icon={homeOutline} />
                        <strong>For You</strong>
                    </div>
                </Link>

                <Link prefetch={true} href="/discover" className={`item ${pathname == '/discover' ? 'active' : ''}`}>
                    <div className="col">
                        <IonIcon icon={searchOutline} />
                        <strong>Discover</strong>
                    </div>
                </Link>

                <div className="fab-button animate dropdown">
                    <span className="fab -mt-6" data-bs-toggle="offcanvas" data-bs-target="#actionSheetCreate">
                        <IonIcon icon={addOutline} role="img" className="md hydrated" aria-label="add outline" />
                    </span>
                    <CreateActionSheet onAddPost={onAddPost} />
                </div>

                <Link prefetch={true} href="/store" className={`item ${pathname.includes('/store') ? 'active' : ''}`}>
                    <div className="col">
                        <IonIcon icon={cartOutline} />
                        <strong>Store</strong>
                    </div>
                </Link>

                <Link prefetch={true} href="/profile" className={`item ${pathname.includes('/profile') ? 'active' : ''}`}>
                    <div className="col flex items-center flex-col ">
                        <img src="/assets/img/icon/f-profile7.svg" alt="profile" className="w-6 h-6" />
                        <strong>Profile</strong>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default memo(Footer);