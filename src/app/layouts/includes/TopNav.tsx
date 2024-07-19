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
import { menuOutline, notifications, chevronBackOutline, qrCode, cartOutline } from 'ionicons/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


export const TopNav: React.FC = () => {
    const pathname = usePathname();
    const { user } = useUser();
    const { totalItems } = useCartStore();
    const [isScanning, setIsScanning] = useState(false);

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
    } = useTopNav({ pathname });

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
                            <img src="/assets/img/logo.png" alt="" />
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
                        {pathname.includes('/store') || pathname.includes('/cart') ? (
                            <Link href="/cart" className="headerButton mr-1">
                                <IonIcon icon={cartOutline} role="img" className="md hydrated" />
                                {totalItems > 0 && (
                                    <span className="badge badge-primary absolute !top-0 !-right-1">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <button className="headerButton" onClick={() => setIsScanning(true)}>
                                <IonIcon icon={qrCode} role="img" className="md hydrated" />
                            </button>
                        )}
                        <Link href="/search" className="headerButton">
                            <IonIcon icon={notifications} role="img" className="md hydrated" />
                        </Link>

                    </div>
                )}

                {pathname === '/garage' && (
                    <div className="right">
                        <Link href={'/garage/add'} className='headerButton headerSave'>
                            Add +
                        </Link>
                    </div>
                )}
                {/* {pathname.includes('/profile/edit/') && (
                    <div className="right">
                        <button className='headerButton headerSave'>
                            Save
                        </button>
                    </div>
                )} */}
            </div>

            {/* {pathname === '/' && (
                <div className="social-tabs">
                    <ul className="nav nav-tabs capsuled" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-bs-toggle="tab" href="#latest-posts" role="tab" aria-selected="false">
                                Latest</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#following-posts" role="tab" aria-selected="true">
                                Following</a>
                        </li>
                    </ul>
                </div>
            )} */}

            {pathname == '/discover' && (
                <DiscoverTabs />
            )}

            {pathname == '/store' && (
                <StoreTabs />
            )}

            <SidePanel />
        </div>
    );
};

const DiscoverTabs = () => {
    return (
        <div className="social-tabs">
            <ul className="nav nav-tabs capsuled" role="tablist">
                <li className="nav-item"> <a className="nav-link active" data-bs-toggle="tab" href="#panels-tab1" role="tab" aria-selected="true">
                    Events</a> </li>
                <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#panels-tab2" role="tab" aria-selected="false">
                    Venues</a> </li>
                <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#panels-tab2" role="tab" aria-selected="false">
                    Garages</a> </li>
                <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#panels-tab3" role="tab" aria-selected="false">
                    Map</a> </li>
            </ul>
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