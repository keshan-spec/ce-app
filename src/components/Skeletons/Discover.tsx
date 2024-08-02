import React from 'react';
import { BannerSkeleton } from '../Discover/DiscoverPage';
import dynamic from 'next/dynamic';

const EventsSliderSkeleton = dynamic(() => import('../Skeletons/EventsSliderSkeleton'), { ssr: false });

const DiscoverSkeleton = () => {
    return (
        <div className="home min-h-screen">
            <div className={"extraHeader p-0"}>
                <div className="search-container">
                    <div className="search-box-top flex items-center gap-2">
                        <input type="text" placeholder="Search" disabled />
                    </div>
                </div>

                <ul className="nav nav-tabs lined" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#top" role="tab">
                            Featured
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#events" role="tab">
                            Events
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#venues" role="tab">
                            Venues
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#users" role="tab">
                            Users & Vehicles
                        </a>
                    </li>
                </ul>
            </div>

            <div className="tab-content pt-14 pb-10">
                <div className="tab-pane fade show active" id="top" role="tabpanel">
                    <div className="section full mt-1">
                        <BannerSkeleton />
                        <div className="header-large-title">
                            <h1 className="title">Trending Events</h1>
                        </div>
                        <div className="section full mt-2 mb-3">
                            <EventsSliderSkeleton />
                        </div>

                        <div className="header-large-title">
                            <h1 className="title">Trending Venues</h1>
                        </div>
                        <div className="section full mt-2 mb-3">
                            <EventsSliderSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DiscoverSkeleton;