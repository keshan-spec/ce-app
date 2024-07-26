'use client';
import { BiCaretRight } from "react-icons/bi";
import { Carousel } from "../Posts/Posts";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getDiscoverData } from "@/actions/home-actions";
import { debounce } from "@/utils/utils";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import clsx from "clsx";
import { IonIcon } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import { Events } from "../Home/Events";

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

export const DiscoverPage: React.FC = () => {
    return (
        <div className="tab-content pt-16 pb-10">
            <div className="tab-pane fade show active" id="top" role="tabpanel">
                <div className="section full mt-1">
                    <Banner />
                    <Events />
                </div>
            </div>

            <div className="tab-pane fade" id="events" role="tabpanel">
                <div className="section full mt-1">
                    <ul className="listview image-listview media search-result mb-2">

                    </ul>
                </div>
            </div>


            <div className="tab-pane fade" id="venues" role="tabpanel">
                <div className="section full mt-1">
                    <ul className="listview image-listview media search-result mb-2">
                    </ul>
                </div>
            </div>

            <div className="tab-pane fade" id="users" role="tabpanel">
                <div className="section full mt-1">
                    <ul className="listview image-listview media search-result mb-2">

                    </ul>
                </div>
            </div>
        </div>
    );
};

const LoadingSkeleton = () => {
    return (
        Array.from({ length: 5 }).map((_, index) => (
            <li className="list-group-item" key={index}>
                <div className="flex items-center py-3 px-3">
                    <div className="flex-shrink-0">
                        <div className="animate-pulse rounded-lg h-16 w-16 bg-gray-300" />
                    </div>
                    <div className="ml-4 w-full flex flex-col gap-2">
                        <div className="animate-pulse h-4 w-1/2 bg-gray-300 rounded" />
                        <div className="animate-pulse h-4 w-1/4 bg-gray-300 rounded" />
                    </div>
                </div>
            </li>
        ))
    );
};