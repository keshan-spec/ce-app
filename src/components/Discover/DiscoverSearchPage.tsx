'use client';
import { useInfiniteQuery } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useState } from "react";
import { getDiscoverData, SearchType } from "@/actions/home-actions";
import { debounce } from "@/utils/utils";
import clsx from "clsx";
import { EventItem, UserItem, VenueItem } from "./SearchResult";

export interface SearchResultEvent {
    id: number;
    name: string;
    thumbnail: string;
}

export interface SearchResultUser {
    id: number;
    name: string;
    username: string;
    thumbnail: string;
    type: 'user' | 'vehicle';
    meta: {
        make: string;
        model: string;
        colour?: string;
        variant?: string;
    };
}

export interface SearchResultVenue {
    id: number;
    name: string;
    thumbnail: string;
    venue_location: string;
    logo: string;
    distance: number;
}

interface TopResults {
    events: SearchResultEvent[];
    users: SearchResultUser[];
    venues: SearchResultVenue[];
}

interface PaginationData<T> {
    total_pages: number;
    page: number;
    limit: number;
    data: T[];
}

interface EventData extends PaginationData<SearchResultEvent> { }
interface UserData extends PaginationData<SearchResultUser> { }
interface VenueData extends PaginationData<SearchResultVenue> { }

interface CombinedData {
    events?: EventData;
    users?: UserData;
    venues?: VenueData;
    top_results?: TopResults;
    success: boolean;
}

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

const DiscoverSearchPage = () => {
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState<SearchType>("all");

    const { isLoading, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
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
        refetchOnMount: true,
        initialPageParam: null,
        enabled: searchText.trim().length >= 3,
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

    const renderVenues = () => {
        return (
            <>
                {(data && data.pages.map((page: CombinedData, index: number) => {
                    return page.venues?.data.map((item) => (
                        <li key={item.id}>
                            <VenueItem item={item} />
                        </li>
                    ));
                }))}

                {(isFetching || isFetchingNextPage) && <LoadingSkeleton />}

                {/* no data */}
                {data && data.pages[0].venues?.data.length === 0 && (
                    <div className="text-center py-5">No results found</div>
                )}
            </>
        );
    };

    const renderUsersAndVehicles = () => {
        return (
            <>
                {(data && data.pages?.map((page: CombinedData, index: number) => {
                    return page.users?.data?.map((item) => (
                        <li key={item.id}>
                            <UserItem item={item} />
                        </li>
                    ));
                }))}

                {(isFetching || isFetchingNextPage) && <LoadingSkeleton />}

                {/* no data */}
                {data && data.pages[0].users?.data.length === 0 && (
                    <div className="text-center py-5">No results found</div>
                )}
            </>
        );
    };

    const renderEvents = () => {
        return (
            <>
                {(data && data.pages.map((page: CombinedData, index: number) => {
                    return page.events?.data.map((item) => (
                        <li key={item.id}>
                            <EventItem item={item} />
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
    };

    const renderTopResults = () => {
        if (isFetching || isFetchingNextPage) return <LoadingSkeleton />;
        if (!data || !data.pages || data.pages.length === 0) return null;
        if (searchType !== "all") return null;

        const hasEvents = data.pages.some((page: CombinedData) => page.top_results?.events && page.top_results.events.length > 0);
        const hasVenues = data.pages.some((page: CombinedData) => page.top_results?.venues && page.top_results.venues.length > 0);
        const hasUsers = data.pages.some((page: CombinedData) => page.top_results?.users && page.top_results.users.length > 0);

        return (
            <>
                {hasEvents && (
                    <>
                        <div className="listview-title garage-sub-title">Top Events</div>
                        <ul className="listview image-listview media search-result mb-2">
                            {data.pages.map((page: CombinedData, index: number) => {
                                return page.top_results?.events.map((item: SearchResultEvent) => (
                                    <li key={item.id}>
                                        <EventItem item={item} />
                                    </li>
                                ));
                            })}
                        </ul>
                    </>
                )}

                {hasVenues && (
                    <>
                        <div className="listview-title garage-sub-title">Top Venues</div>
                        <ul className="listview image-listview media search-result mb-2">
                            {data.pages.map((page: CombinedData, index: number) => {
                                return page.top_results?.venues.map((item: SearchResultVenue) => (
                                    <li key={item.id}>
                                        <VenueItem item={item} />
                                    </li>
                                ));
                            })}
                        </ul>
                    </>
                )}

                {hasUsers && (
                    <>
                        <div className="listview-title garage-sub-title">Top Users & Vehicles</div>
                        <ul className="listview image-listview media search-result mb-2">
                            {data.pages.map((page: CombinedData, index: number) => {
                                return page.top_results?.users.map((item: SearchResultUser) => (
                                    <li key={item.id}>
                                        <UserItem item={item} />
                                    </li>
                                ));
                            })}
                        </ul>
                    </>
                )}
            </>
        );

    };

    return (
        <div className="home">
            <div className={clsx("extraHeader p-0")}>
                <div className="search-container">
                    <div className="search-box-top flex items-center gap-2">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search"
                            defaultValue={searchText}
                            onChange={(e) => debouncedHandleTagInputChange(e.target.value)}
                        />
                    </div>
                </div>

                <ul className="nav nav-tabs lined" role="tablist">
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
                </ul>
            </div>

            <div className="tab-content pt-16 pb-10">
                <div className="tab-pane fade show active" id="top" role="tabpanel">
                    <div className="section full mt-1">
                        {renderTopResults()}
                    </div>
                </div>

                <div className="tab-pane fade" id="events" role="tabpanel">
                    <div className="section full mt-1">
                        <ul className="listview image-listview media search-result mb-2">
                            {renderEvents()}
                        </ul>
                    </div>
                </div>


                <div className="tab-pane fade" id="venues" role="tabpanel">
                    <div className="section full mt-1">
                        <ul className="listview image-listview media search-result mb-2">
                            {renderVenues()}
                        </ul>
                    </div>
                </div>

                <div className="tab-pane fade" id="users" role="tabpanel">
                    <div className="section full mt-1">
                        <ul className="listview image-listview media search-result mb-2">
                            {renderUsersAndVehicles()}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(DiscoverSearchPage);