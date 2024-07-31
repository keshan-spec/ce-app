'use client';
import QRScanner from '@/components/Scanner/Scanner';
import { SidePanel } from '@/components/SidePanel';
import { useCartStore } from '@/hooks/useCartStore';
import { useTopNav } from '@/hooks/useTopNav';
import { useUser } from '@/hooks/useUser';
import PopUp from '@/shared/Dialog';
import { sendRNMessage } from '@/utils/nativeFeel';
import { IonIcon } from '@ionic/react';
import clsx from 'clsx';
import { menuOutline, notifications, chevronBackOutline, cartOutline, qrCodeOutline, searchOutline } from 'ionicons/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getNotificationCount } from "@/actions/notification-actions";
import useLoading from '@/hooks/useLoading';

export const TopNav: React.FC = () => {
    const pathname = usePathname();
    const { user } = useUser();
    const { totalItems } = useCartStore();
    const [isScanning, setIsScanning] = useState(false);

    const { loading, nextPage } = useLoading();

    const activePath = useMemo(() => {
        if (loading && nextPage) {
            return nextPage;
        }

        return pathname;
    }, [pathname, loading, nextPage]);

    const { data } = useQuery({
        queryKey: ["notification-count"],
        queryFn: () => getNotificationCount(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    useEffect(() => {
        // send user data to react native every time the app loads
        sendRNMessage({
            type: "authData",
            user_id: user.id,
        });
    }, []);

    const {
        mode,
        returnTo,
        title,
        showLogo,
        showMenuIcon,
        showHeaderIcons,
        subtitle,
    } = useTopNav({ pathname: activePath });

    const onHeaderSave = () => {
        // press different submit buttons based on the page
        let elementSelector = '';

        if (pathname.includes('/profile/edit/')) {
            elementSelector = '#profileForm';
        } else if (pathname.includes('/garage/edit/')) {
            elementSelector = '#garageForm';
        } else if (pathname.includes('/garage/add')) {
            elementSelector = '#garageAddForm';
        }

        if (elementSelector) {
            const submitButton = document.querySelector(`button${elementSelector}`) as HTMLElement;
            if (submitButton) {
                // click the submit button
                submitButton.click();
            }
        }
    };

    return (
        <div className={clsx(
            "appHeader scrolled header-div-wrapper",
            mode === 'view-page' ? 'bg-white min-h-14' : 'bg-primary',
        )}>
            <PopUp
                isOpen={isScanning} onClose={() => setIsScanning(false)}>
                <QRScanner />
            </PopUp>

            <div className="header-row-wrapper-top">
                <div className="left">
                    {showMenuIcon ? (
                        <span className="headerButton" data-bs-toggle="offcanvas" data-bs-target="#sidebarPanel" role='button'>
                            <IonIcon icon={menuOutline} role="img" className="md hydrated" />
                        </span>
                    ) : (
                        <button onClick={returnTo}>
                            <span className="headerButton">
                                <IonIcon icon={chevronBackOutline} role="img" className="md hydrated" />
                            </span>
                        </button>
                    )}
                </div>

                {showLogo && (
                    <div className="max-w-36 !mt-5">
                        <Link href="/">
                            <img src="/assets/img/logo-dark.png" alt="" />
                        </Link>
                    </div>
                )}

                {title && (
                    <div className="header-logo">
                        <span>{title}</span>
                        {subtitle}
                    </div>
                )}

                {showHeaderIcons && (
                    <div className="right">
                        {activePath.includes('/store') || activePath.includes('/cart') ? (
                            <Link href="/cart" className="headerButton mr-1">
                                <IonIcon icon={cartOutline} role="img" className="md hydrated" />
                                {totalItems > 0 && (
                                    <span className="badge badge-primary absolute !top-0 !-right-1">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <>
                                {!activePath.includes('/profile') && (
                                    <button className="headerButton" onClick={() => setIsScanning(true)}>
                                        <IonIcon icon={qrCodeOutline} role="img" className="md hydrated" />
                                    </button>
                                )}
                            </>
                        )}

                        {!activePath.includes('/notifications') && (
                            <Link href="/notifications" className="headerButton relative">
                                <IonIcon icon={notifications} role="img" className="md hydrated" />
                                {data && data.count > 0 && (
                                    <span className="badge badge-primary absolute !-top-1 !-right-1">
                                        {data.count}
                                    </span>
                                )}
                            </Link>
                        )}

                        {activePath.includes('/profile') && (
                            <Link href="/discover?dtype=search" className="headerButton">
                                <IonIcon icon={searchOutline} role="img" className="md hydrated" />
                            </Link>
                        )}
                    </div>
                )}

                {activePath === '/garage' && (
                    <div className="right">
                        <Link href={'/garage/add'} className='headerButton headerSave'>
                            Add +
                        </Link>
                    </div>
                )}
                {(/*pathname.includes('/profile/edit/') || pathname.includes('/garage/edit/') ||*/ activePath.includes('/garage/add')) && (
                    <div className="right">
                        <button className='headerButton headerSave' onClick={onHeaderSave}>
                            Save
                        </button>
                    </div>
                )}
            </div>

            {activePath == '/store' && (
                <StoreTabs />
            )}

            <SidePanel />
        </div>
    );
};

const StoreTabs = () => {
    return (
        <div className="social-tabs">
            <ul className="nav nav-tabs capsuled" role="tablist">
                <li className="nav-item"> <a className="nav-link active" data-bs-toggle="tab" href="#panels-tab1" role="tab">
                    Products</a> </li>
                <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#panels-tab2" role="tab">
                    My Orders</a> </li>
            </ul>
        </div>
    );
};