'use client';
import { usePage } from "@/app/context/PageProvider";
import { CreateActionSheet } from "@/components/ActionSheets/Create";
import { useUser } from "@/hooks/useUser";
import { sendRNMessage } from "@/utils/nativeFeel";
import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import { homeOutline, searchOutline, addOutline, cartOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import { memo } from "react";

const Footer = () => {
    const pathname = usePathname();
    const { user } = useUser();

    const { activePage, setActivePage } = usePage();

    const onAddPost = () => {
        if (!user) return;

        sendRNMessage({
            type: "createPost",
            user_id: user.id,
            page: pathname,
        });
    };

    const handlePageChange = (page: string) => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={clsx("appBottomMenu")}>
            <button
                className={`item ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => handlePageChange('home')}
            >
                <div className="col">
                    <IonIcon icon={homeOutline} />
                    <strong>For You</strong>
                </div>
            </button>

            <button
                className={`item ${activePage === 'discover' ? 'active' : ''}`}
                onClick={() => handlePageChange('discover')}
            >
                <div className="col">
                    <IonIcon icon={searchOutline} />
                    <strong>Discover</strong>
                </div>
            </button>

            <div className="fab-button animate dropdown">
                <span className="fab -mt-6" data-bs-toggle="offcanvas" data-bs-target="#actionSheetCreate">
                    <IonIcon icon={addOutline} role="img" className="md hydrated" aria-label="add outline" />
                </span>
                <CreateActionSheet onAddPost={onAddPost} />
            </div>

            <button
                className={`item ${activePage === 'store' ? 'active' : ''}`}
                onClick={() => handlePageChange('store')}
            >
                <div className="col">
                    <IonIcon icon={cartOutline} />
                    <strong>Store</strong>
                </div>
            </button>

            <button
                className={`item ${activePage === 'profile' ? 'active' : ''}`}
                onClick={() => handlePageChange('profile')}
            >
                <div className="col flex items-center flex-col">
                    <img src="/assets/img/icon/f-profile7.svg" alt="profile" className="w-6 h-6" />
                    <strong>Profile</strong>
                </div>
            </button>
        </div>
    );
};


export default memo(Footer);