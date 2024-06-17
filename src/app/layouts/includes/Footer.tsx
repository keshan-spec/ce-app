'use client';

import { CreatePostProvider, CreatePostSteps } from "@/app/context/CreatePostContext";
import { CreateActionSheet } from "@/components/ActionSheets/Create";
import SlideInPanel from "@/shared/CreatePostSlideIn";
import { IonIcon } from "@ionic/react";
import { homeOutline, searchOutline, idCardOutline, addOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        ReactNativeWebView: {
            postMessage: (message: string) => void;
        };
    }
}

export const Footer: React.FC = () => {
    const pathname = usePathname();
    const [isOpen, setOpen] = useState<boolean>(false);

    const onAddPost = () => {
        // setOpen(true);
        // return;

        if (typeof window.ReactNativeWebView === 'undefined') {
            console.log('window.ReactNativeWebView:', window.ReactNativeWebView);
            throw new Error('This is not a react native webview');
        }

        try {
            if (window !== undefined && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'createPost',
                    page: pathname,
                }));
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <CreatePostProvider>
                <SlideInPanel isOpen={isOpen} onClose={() => setOpen(false)}>
                    <CreatePostSteps
                        closePanel={() => {
                            setOpen(false);
                        }}
                    />
                </SlideInPanel>
            </CreatePostProvider>
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
                    <CreateActionSheet onAddPost={onAddPost} />
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