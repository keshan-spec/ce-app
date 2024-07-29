'use client';
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getDiscoverData, SearchType } from "@/actions/home-actions";
import { debounce } from "@/utils/utils";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import clsx from "clsx";
import { DiscoverPage } from "../Discover/Discover";
import { useRouter, useSearchParams } from "next/navigation";
import NcImage from "../Image/Image";

interface Event {
    id: number;
    name: string;
    thumbnail: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    thumbnail: string;
}

interface Venue {
    id: number;
    name: string;
    thumbnail: string;
}

interface PaginationData<T> {
    total_pages: number;
    page: number;
    limit: number;
    data: T[];
}

interface EventData extends PaginationData<Event> { }
interface UserData extends PaginationData<User> { }
interface VenueData extends PaginationData<Venue> { }

interface CombinedData {
    events?: EventData;
    users?: UserData;
    venues?: VenueData;
    success: boolean;
}

export const HomePage: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState<SearchType>("all");
    const router = useRouter();
    const searchParam = useSearchParams();

    const { isLoading, error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey: ["discover-search", searchText, searchType],
        queryFn: ({ pageParam }) => {
            return getDiscoverData(searchText, searchType, pageParam || 1);
        },
        getNextPageParam: (lastPage: CombinedData, pages: CombinedData[]) => {
            if (searchType === "all") return undefined;

            const page = lastPage[searchType];
            if (!page) return undefined;

            const maxPages = Math.ceil(page.total_pages / page.limit);
            const nextPage = pages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        initialPageParam: null,
        enabled: searchText.trim().length > 3,
    });

    // Infinite scroll
    useEffect(() => {
        let fetching = false;
        const onScroll = async (event: any) => {
            const { scrollHeight, scrollTop, clientHeight } =
                event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true;
                if (hasNextPage) await fetchNextPage();
                fetching = false;
            }
        };

        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNextPage]);

    const handleInputChange = async (search: string) => {
        setSearchText(search);

        await refetch({
            cancelRefetch: isFetching || isLoading || isFetchingNextPage,
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
            setSearchType("all");
        }
    }, [searchParam]);

    const onSearchClick = () => {
        setSearchVisible(true);
        router.push('/discover?dtype=search',);
    };

    const renderSearchResults = (type: SearchType) => {
        if (type === "all") {
            return (
                <>
                    {(data && data.pages.map((page: CombinedData, index: number) => {
                        return page.events?.data.map((item: Event) => (
                            <li key={item.id}>
                                <a href="#" className="item">
                                    <div className="imageWrapper">
                                        <NcImage
                                            src={item.thumbnail}
                                            alt="image"
                                            imageDimension={{
                                                height: 60,
                                                width: 100,
                                            }}
                                            className="max-w-20 object-cover w-full"
                                        />
                                    </div>
                                    <div className="in">
                                        <div>
                                            <h4 className="mb-05" dangerouslySetInnerHTML={{
                                                __html: item.name,
                                            }} />
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ));
                    }))}

                    {(isFetching || isFetchingNextPage) && <LoadingSkeleton />}

                    {/* no data */}
                    {data && data.pages[0].events?.data.length === 0 && (
                        <div className="text-center py-5">No results found</div>
                    )}
                </>
            );
        }

        return (
            <>
                {(data && data.pages.map((page: CombinedData, index: number) => {
                    return page[type]?.data.map((item: any) => (
                        <li key={item.id}>
                            <a href="#" className="item">
                                <div className="imageWrapper">
                                    <NcImage
                                        src={item.thumbnail || PLACEHOLDER_PFP}
                                        alt="image"
                                        imageDimension={{
                                            height: 60,
                                            width: 100,
                                        }}
                                        className="max-w-20 object-cover w-full"
                                    />
                                </div>
                                <div className="in">
                                    <div>
                                        <h4 className="mb-05 text-sm truncate max-w-60">
                                            {type === "users" ? item.username : item.name}
                                        </h4>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ));
                }))}

                {(isFetching || isFetchingNextPage) && <LoadingSkeleton />}


                {/* no data */}
                {data && data.pages[0][type]?.data.length === 0 && (
                    <div className="text-center py-5">No results found</div>
                )}
            </>
        );
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
                                <a className="nav-link active" data-bs-toggle="tab" href="#top" role="tab" onClick={() => setSearchType("all")}>
                                    Top
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#events" role="tab" onClick={() => setSearchType("events")}>
                                    Events
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#venues" role="tab" onClick={() => setSearchType("venues")}>
                                    Venues
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#users" role="tab" onClick={() => setSearchType("users")}>
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
                                {renderSearchResults("all")}
                            </ul>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="events" role="tabpanel">
                        <div className="section full mt-1">
                            <ul className="listview image-listview media search-result mb-2">
                                {renderSearchResults("events")}
                            </ul>
                        </div>
                    </div>


                    <div className="tab-pane fade" id="venues" role="tabpanel">
                        <div className="section full mt-1">
                            <ul className="listview image-listview media search-result mb-2">
                                {renderSearchResults("venues")}
                            </ul>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="users" role="tabpanel">
                        <div className="section full mt-1">
                            <ul className="listview image-listview media search-result mb-2">
                                {renderSearchResults("users")}
                            </ul>
                        </div>
                    </div>
                </div>
            ) :
                <DiscoverPage />
            }
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