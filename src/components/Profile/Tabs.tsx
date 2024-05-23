import { Feed } from './Sections/Feed';
import { Garage } from './Sections/Garage';
import { Bookmarks } from './Sections/Bookmarks';
import { useUser } from '@/hooks/useUser';
import { useCallback, useState } from 'react';

interface TabsProps {
    profileId: string;
}

export const Tabs: React.FC<TabsProps> = ({
    profileId
}) => {
    const [activeTab, setActiveTab] = useState<'garage' | 'feed' | 'tagged-posts' | 'bookmarks' | 'settings'>('garage');

    const renderTabs = useCallback(() => {
        switch (activeTab) {
            case 'garage':
                return <Garage />;
            case 'feed':
                return <Feed profileId={profileId} />;
            case 'tagged-posts':
                return <Feed profileId={profileId} tagged={true} />;
            case 'bookmarks':
                return <Bookmarks />;
            case 'settings':
                return <div>Settings</div>;
            default:
                return <Garage />;
        }
    }, [activeTab, profileId]);

    return (
        <>
            <div className="section full">
                <div className="wide-block transparent p-0">
                    <ul className="nav nav-tabs lined iconed" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-bs-toggle="tab" href="#garage" role="tab" aria-selected="true" onClick={() => setActiveTab('garage')}>
                                Garage
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#feed" role="tab" onClick={() => setActiveTab('feed')}>
                                Posts
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#tagged-posts" role="tab" onClick={() => setActiveTab('tagged-posts')}>
                                Tagged
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#bookmarks" role="tab">
                                Bookmarks
                            </a>
                        </li> 
                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" href="#settings" role="tab">
                                <ion-icon name="settings-outline" role="img" className="md hydrated" aria-label="settings outline"></ion-icon>
                            </a>
                        </li> */}
                    </ul>
                </div>
            </div>


            <div className="section full mb-2">
                <div className="tab-content">
                    {renderTabs()}
                </div>
            </div>
        </>
    );
};