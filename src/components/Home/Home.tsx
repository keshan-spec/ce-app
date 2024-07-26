'use client';
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getDiscoverData } from "@/actions/home-actions";
import { debounce } from "@/utils/utils";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import clsx from "clsx";
import { DiscoverPage } from "../Discover/Discover";
import { useRouter, useSearchParams } from "next/navigation";
import NcImage from "../Image/Image";

export const HomePage: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const router = useRouter();
    const searchParam = useSearchParams();

    const { data, isFetching, isLoading, refetch } = useQuery<any, Error>({
        queryKey: ["discover-search", searchText],
        queryFn: () => getDiscoverData(searchText, 'all', 1),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: searchText.trim().length > 3,
    });

    const handleInputChange = async (search: string) => {
        setSearchText(search);

        await refetch({
            cancelRefetch: isFetching || isLoading,
        });
    };

    const debouncedHandleTagInputChange = useCallback(debounce(handleInputChange, 500), []);
    const [searchVisible, setSearchVisible] = useState(false);

    // on params change
    useEffect(() => {
        if (searchParam.get('dtype') && searchParam.get('dtype') === 'search') {
            setSearchVisible(true);
        } else {
            setSearchVisible(false);
            setSearchText("");
        }
    }, [searchParam]);


    const onSearchClick = () => {
        setSearchVisible(true);
        router.push('/discover?dtype=search',);
    };

    return (
        <div className="home">
            <div className={clsx(
                "extraHeader p-0",
                // searchVisible ? "!h-auto" : "!top-0"
            )}>
                <div className="search-container">
                    <div className="search-box-top flex items-center gap-2">
                        <input type="text" placeholder="Search" defaultValue={searchText}
                            onClick={onSearchClick}
                            onChange={(e) => debouncedHandleTagInputChange(e.target.value)}
                        />
                    </div>
                </div>

                <ul className="nav nav-tabs lined" role="tablist">
                    {searchVisible ? (
                        <>
                            <li className="nav-item">
                                <a className="nav-link active" data-bs-toggle="tab" href="#top" role="tab">
                                    Top
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
                        </>
                    ) : (
                        <>
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
                        </>

                    )}
                </ul>
            </div>

            {searchVisible ? (
                <div className="tab-content pt-16 pb-10">
                    <div className="tab-pane fade show active" id="top" role="tabpanel">
                        <div className="section full mt-1">
                            <ul className="listview image-listview media search-result mb-2">
                                {isFetching && <LoadingSkeleton />}
                                {(data && data.events?.length > 0) && data.events.map((event: any, index: number) => (
                                    <li key={event.id}>
                                        <a href="#" className="item">
                                            <div className="imageWrapper">
                                                <NcImage
                                                    src={event.thumbnail}
                                                    alt="image"
                                                    imageDimension={{
                                                        height: 60,
                                                        width: 60,
                                                    }}
                                                    className="max-w-20 object-cover w-full"
                                                />
                                            </div>
                                            <div className="in">
                                                <div>
                                                    <h4 className="mb-05" dangerouslySetInnerHTML={{
                                                        __html: event.title,
                                                    }} />
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="events" role="tabpanel">
                        <div className="section full mt-1">
                            <ul className="listview image-listview media search-result mb-2">
                                {isFetching && <LoadingSkeleton />}
                                {(data && data.events?.length > 0) && data.events.map((event: any, index: number) => (
                                    <li key={event.id}>
                                        <a href="#" className="item">
                                            <div className="imageWrapper">
                                                <NcImage
                                                    src={event.thumbnail}
                                                    alt="image"
                                                    imageDimension={{
                                                        height: 60,
                                                        width: 60,
                                                    }}
                                                    className="max-w-20 object-cover w-full"
                                                />
                                            </div>
                                            <div className="in">
                                                <div>
                                                    <h4 className="mb-05" dangerouslySetInnerHTML={{
                                                        __html: event.title,
                                                    }} />
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                    <div className="tab-pane fade" id="venues" role="tabpanel">
                        <div className="section full mt-1">
                            <ul className="listview image-listview media search-result mb-2">
                                {isFetching && <LoadingSkeleton />}
                            </ul>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="users" role="tabpanel">
                        <div className="section full mt-1">
                            <ul className="listview image-listview media search-result mb-2">
                                {isFetching && <LoadingSkeleton />}

                                {(data && data.users?.length > 0) && data.users.map((item: any, index: number) => (
                                    <li key={item.id}>
                                        <a href="#" className="item">
                                            <div className="imageWrapper">
                                                <NcImage
                                                    src={item.profile_image || PLACEHOLDER_PFP}
                                                    alt="image"
                                                    imageDimension={{
                                                        height: 60,
                                                        width: 60,
                                                    }}
                                                    className="max-w-20 object-cover w-full"
                                                />
                                            </div>
                                            <div className="in">
                                                <div>
                                                    <h4 className="mb-05">
                                                        {item.username}
                                                    </h4>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : <DiscoverPage />}
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