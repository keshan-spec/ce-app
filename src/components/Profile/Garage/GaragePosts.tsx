import Link from 'next/link';
import { useCallback, useState } from 'react';
import { GaragePostsTab } from './Tabs/Posts';

interface GaragePostsProps {
    garageId: string;
}

export const GaragePosts: React.FC<GaragePostsProps> = ({
    garageId
}) => {
    const [activeTab, setActiveTab] = useState<'tagged-posts' | 'posts'>('posts');

    const renderTabs = useCallback(() => {
        switch (activeTab) {
            case 'tagged-posts':
                return <GaragePostsTab garageId={garageId} isTagged={true} />;
            case 'posts':
            default:
                return <GaragePostsTab garageId={garageId} />;
        }
    }, [activeTab]);

    return (
        <>
            <div className="section full">
                <div className="wide-block transparent p-0">
                    <ul className="nav nav-tabs lined iconed" role="tablist">
                        <li className="nav-item">
                            <Link className="nav-link active" data-bs-toggle="tab" href="#posts" role="tab" onClick={() => setActiveTab('posts')}>
                                Posts
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" data-bs-toggle="tab" href="#tags" role="tab" onClick={() => setActiveTab('tagged-posts')}>
                                Tags
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>

            <div className="section full">
                <div className="tab-content">
                    {renderTabs()}
                </div>
            </div>
        </>
    );
};