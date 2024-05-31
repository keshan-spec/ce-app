import { SidePanel } from '@/components/SidePanel';
import { useTopNav, TopNavMode } from '@/hooks/useTopNav';
import { IonIcon } from '@ionic/react';
import clsx from 'clsx';
import { menuOutline, notifications, searchOutline, chevronBackOutline } from 'ionicons/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export const TopNav: React.FC = () => {
    const pathname = usePathname();
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
            <div className="header-row-wrapper-top">
                <div className="left">
                    {showMenuIcon ? (
                        <span className="headerButton" data-bs-toggle="offcanvas" data-bs-target="#sidebarPanel" role='button'>
                            <IonIcon icon={menuOutline} />
                        </span>
                    ) : (
                        <Link href={returnTo}>
                            <span className="headerButton">
                                <IonIcon icon={chevronBackOutline} />
                            </span>
                        </Link>
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
                        <Link href="/" className="headerButton">
                            <IonIcon icon={notifications} />
                        </Link>
                        <Link href="/search" className="headerButton">
                            <IonIcon icon={searchOutline} />
                        </Link>
                    </div>
                )}
            </div>

            {pathname === '/posts' && (
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
            )}

            {pathname == '/' && (
                <div className="header-row-wrapper2">
                    <ul className="nav nav-tabs capsuled" role="tablist">
                        <li className="nav-item">
                            <Link className="nav-link active" data-bs-toggle="tab" href="#panels-tab1" role="tab">
                                Events
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" data-bs-toggle="tab" href="#panels-tab2" role="tab">
                                Venues
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" data-bs-toggle="tab" href="#panels-tab4" role="tab">
                                Saved
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            <SidePanel />
        </div>
    );
};