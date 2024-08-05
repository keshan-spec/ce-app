'use client';
import Link from "next/link";
import { BiCaretRight } from "react-icons/bi";
import { DiscoverFilterProvider } from "@/app/context/DiscoverFilterContext";
import { memo, useEffect, useState } from "react";
import { SearchType } from "@/actions/home-actions";

import dynamic from "next/dynamic";
import useSwipeableIndexes from "@/hooks/useSwipable";
import clsx from "clsx";

const Carousel = dynamic(() => import('@/shared/Carousel'));
const TrendingVenues = dynamic(() => import('@/components/Home/Cards/TrendingVenues'));
const TrendingEvents = dynamic(() => import('@/components/Home/Cards/TrendingEvents'));

const Venues = dynamic(() => import('@/components/Home/Cards/Venue'));
const Events = dynamic(() => import('@/components/Home/Cards/Events'));
const DiscoverFilters = dynamic(() => import('./Filters'));

const bannerData = [
    {
        title: "Great British Motor Show",
        date: "17th – 20th August",
        img: "assets/img/sample/photo/home-slider-1.jpg",
    },
    {
        title: "Great British Motor Show",
        date: "17th – 20th August",
        img: "assets/img/sample/photo/home-slider-2.jpg",
    },
];

const Banner = () => {
    return (
        <div className="section full mb-4 overflow-hidden px-3">
            <Carousel
                className="rounded-lg"
                settings={{
                    loop: true
                }}>
                {bannerData.map((banner, index) => (
                    <div key={index} className="embla__slide relative">
                        <div className="carousel-full-img">
                            <img src={banner.img} alt="alt" className="imaged w-100 square" />
                        </div>
                        <div className="slider-home-info-row">
                            <div className="slider-home-info-left">
                                <h2 className="">
                                    {banner.title}
                                </h2>
                                <p>{banner.date}</p>
                                <div className="slider-home-info-right">
                                    <Link href="#" className="theme-btn-1 ">
                                        See More <BiCaretRight className="inline" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export const BannerSkeleton = () => {
    return (
        <div className="section full mb-4 overflow-hidden px-3">
            <div className="bg-gray-300 relative">
                <div className="">
                    <div className="bg-gray-200 rounded-md w-full h-56  animate-pulse"></div>
                </div>
                <div className="slider-home-info-row">
                    <div className="slider-home-info-left">
                        <div className="bg-gray-200 rounded-md h-8 w-3/4 mb-2  animate-pulse"></div>
                        <div className="bg-gray-200 rounded-md h-4 w-1/2  animate-pulse"></div>
                        <div className="slider-home-info-right">
                            <div className="bg-gray-200 rounded-md h-8 w-24  animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DiscoverPage = () => {
    const [searchType, setSearchType] = useState<SearchType>('all');
    const {
        activeIndex,
        handlers,
    } = useSwipeableIndexes(3);

    useEffect(() => {
        switch (activeIndex) {
            case 0:
                setSearchType('all');
                break;
            case 1:
                setSearchType('events');
                break;
            case 2:
                setSearchType('venues');
                break;
            case 3:
                setSearchType('users');
                break;
            default:
                setSearchType('all');
                break;
        }
    }, [activeIndex]);

    const renderActiveTab = () => {
        switch (searchType) {
            case 'events':
                return (
                    <DiscoverFilterProvider>
                        <div className="tab-pane fade show active" id="events" role="tabpanel">
                            <div className="section full mt-1">
                                <DiscoverFilters key={'events'} type="events" />
                                <ul className="listview image-listview media search-result mb-2 !border-none">
                                    <Events />
                                </ul>
                            </div>
                        </div>
                    </DiscoverFilterProvider>
                );
            case 'venues':
                return (
                    <DiscoverFilterProvider>
                        <div className="tab-pane fade show active" id="venues" role="tabpanel">
                            <div className="section full mt-1">
                                <DiscoverFilters key={'venues'} type="venues" />
                                <ul className="listview image-listview media search-result mb-2">
                                    <Venues />
                                </ul>
                            </div>
                        </div>
                    </DiscoverFilterProvider>
                );
            case 'users':
                return <div>Users & Vehicles</div>;
            default:
                return (
                    <div className="tab-pane fade show active" id="top" role="tabpanel">
                        <div className="section full mt-1">
                            <Banner />
                            <TrendingEvents />
                            <TrendingVenues />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="home min-h-screen" {...handlers}>
            <div className={"extraHeader p-0"}>
                <div className="search-container">
                    <div className="search-box-top flex items-center gap-2">
                        <Link prefetch={true} href="/search" className="w-full">
                            <input type="text" placeholder="Search" />
                        </Link>
                    </div>
                </div>

                <ul className="nav nav-tabs lined" role="tablist">
                    <li className="nav-item">
                        <a className={clsx(
                            "nav-link",
                            searchType === 'all' && 'active'
                        )} data-bs-toggle="tab" href="#top" role="tab" onClick={() => setSearchType("all")}>
                            Featured
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={clsx(
                            "nav-link",
                            searchType === 'events' && 'active'
                        )} data-bs-toggle="tab" href="#events" role="tab" onClick={() => setSearchType("events")}>
                            Events
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={clsx(
                            "nav-link",
                            searchType === 'venues' && 'active'
                        )} data-bs-toggle="tab" href="#venues" role="tab" onClick={() => setSearchType("venues")}>
                            Venues
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={clsx(
                            "nav-link",
                            searchType === 'users' && 'active'
                        )} data-bs-toggle="tab" href="#users" role="tab" onClick={() => setSearchType("users")}>
                            Users & Vehicles
                        </a>
                    </li>
                </ul>
            </div>

            <div className="tab-content pt-14 pb-10">
                {renderActiveTab()}
                {/* <div className="tab-pane fade show active" id="top" role="tabpanel">
                    <div className="section full mt-1">
                        <Banner />
                        <TrendingEvents />
                        <TrendingVenues />
                    </div>
                </div>

                <DiscoverFilterProvider>
                    <div className="tab-pane fade" id="events" role="tabpanel">
                        <div className="section full mt-1">
                            <DiscoverFilters key={'events'} type="events" />

                            {searchType === 'events' && (
                                <ul className="listview image-listview media search-result mb-2 !border-none">
                                    <Events />
                                </ul>
                            )}
                        </div>
                    </div>
                </DiscoverFilterProvider>

                <DiscoverFilterProvider>
                    <div className="tab-pane fade" id="venues" role="tabpanel">
                        <div className="section full mt-1">
                            <DiscoverFilters key={'venues'} type="venues" />
                            {searchType === 'venues' && (
                                <ul className="listview image-listview media search-result mb-2">
                                    <Venues />
                                </ul>
                            )}
                        </div>
                    </div>
                </DiscoverFilterProvider>

                <div className="tab-pane fade" id="users" role="tabpanel">
                    <div className="section full mt-1">
                        {searchType === 'users' && (
                            <ul className="listview image-listview media search-result mb-2">
                            </ul>
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default memo(DiscoverPage);