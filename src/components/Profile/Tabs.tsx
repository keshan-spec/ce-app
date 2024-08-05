'use client';
import { useCallback, useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import dynamic from 'next/dynamic';
import useSwipeableIndexes from '@/hooks/useSwipable';
import clsx from 'clsx';

const Feed = dynamic(() => import('@/components/Profile/Sections/Feed'), { ssr: false });
const Bookmarks = dynamic(() => import('@/components/Profile/Sections/Bookmarks'), { ssr: false });
const Settings = dynamic(() => import('@/components/Profile/Sections/Settings'), { ssr: false });
const Garage = dynamic(() => import('@/components/Profile/Garage/Garage'));

interface TabsProps {
    profileId: string;
    thirdPersionView: boolean;
}

const Tabs: React.FC<TabsProps> = ({
    profileId,
    thirdPersionView = false
}) => {
    const {
        activeIndex,
        handlers,
    } = useSwipeableIndexes(3 + (thirdPersionView ? 1 : 0));

    useEffect(() => {
        switch (activeIndex) {
            case 0:
                setActiveTab('garage');
                break;
            case 1:
                setActiveTab('feed');
                break;
            case 2:
                setActiveTab('tagged-posts');
                break;
            case 3:
                setActiveTab('settings');
                break;
            default:
                setActiveTab('garage');
                break;
        }
    }, [activeIndex]);


    const [activeTab, setActiveTab] = useState<'garage' | 'feed' | 'tagged-posts' | 'bookmarks' | 'settings'>('garage');

    const renderTabs = useCallback(() => {
        switch (activeTab) {
            case 'garage':
                return <Garage profileId={profileId} />;
            case 'feed':
                return <Feed profileId={profileId} />;
            case 'tagged-posts':
                return <Feed profileId={profileId} tagged={true} />;
            case 'bookmarks':
                return <Bookmarks />;
            case 'settings':
                return <Settings />;
            default:
                return <Garage profileId={profileId} />;
        }
    }, [activeTab, profileId]);

    return (
        <div {...handlers} className='h-full min-h-screen'>
            <div className="section full">
                <div className="wide-block transparent p-0">
                    <ul className="nav nav-tabs lined iconed" role="tablist">
                        <li className="nav-item">
                            <a className={clsx(
                                "nav-link",
                                activeTab === 'garage' && 'active'
                            )} href="#garage" role="tab" aria-selected="true" onClick={() => setActiveTab('garage')}>
                                Garage
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={clsx(
                                "nav-link",
                                activeTab === 'feed' && 'active'
                            )} data-bs-toggle="tab" href="#feed" role="tab" onClick={() => setActiveTab('feed')}>
                                Posts
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={clsx(
                                "nav-link",
                                activeTab === 'tagged-posts' && 'active'
                            )} data-bs-toggle="tab" href="#tagged-posts" role="tab" onClick={() => setActiveTab('tagged-posts')}>
                                Tags
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#bookmarks" role="tab">
                                Bookmarks
                            </a>
                        </li>  */}
                        {thirdPersionView && (
                            <li className="nav-item">
                                <a className={clsx(
                                    "nav-link",
                                    activeTab === 'settings' && 'active'
                                )} data-bs-toggle="tab" href="#settings" role="tab" onClick={() => setActiveTab('settings')}>
                                    <IonIcon icon={settingsOutline} role="img" className="md hydrated" aria-label="settings outline" />
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="section full mb-2 h-full">
                <div className="tab-content pb-4">
                    {renderTabs()}
                </div>
            </div>
        </div>
    );
};

export default Tabs;