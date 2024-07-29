import { DiscoverFilterContextType, useDiscoverFilters } from "@/app/context/DiscoverFilterContext";
import SlideInFromBottomToTop from "@/shared/SlideIn";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { IonIcon } from "@ionic/react";
import { DatePicker, NextUIProvider } from "@nextui-org/react";
import clsx from "clsx";
import { calendarOutline, caretDownOutline, closeCircle, locateOutline, locationOutline, mapOutline, pieChartOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

const formatFilterDate = (start: string, end: string | null) => {
    // format date Jul 23, 2021
    // if end then, Jul 23 - 25, 2021

    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const startDay = startDate.getDate();
    const startYear = startDate.getFullYear();

    if (endDate) {
        const endMonth = endDate.toLocaleString('default', { month: 'short' });
        const endDay = endDate.getDate();
        const endYear = endDate.getFullYear();

        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
    }

    return `${startMonth} ${startDay}, ${startYear}`;
};

const DateFilter: React.FC<{
    onComplete: () => void;
}> = ({ onComplete }) => {
    const { dateFilter, customDateRange, onDateFilterChange } = useDiscoverFilters();
    const [localDate, setLocalDate] = useState<DiscoverFilterContextType['dateFilter']>(dateFilter);
    const [localCustomDateRange, setLocalCustomDateRange] = useState<DiscoverFilterContextType['customDateRange']>(customDateRange);

    const onApply = () => {
        onDateFilterChange(localDate, localCustomDateRange);
        onComplete();
    };

    return (
        <div className="px-2 filter-panel">
            <ul className="listview image-listview text !border-none">
                <li onClick={() => {
                    setLocalDate("anytime");
                }}>
                    <div className={clsx(
                        "item",
                        localDate === "anytime" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>Anytime</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => {
                    setLocalDate("today");
                }}>
                    <div className={clsx(
                        "item",
                        localDate === "today" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>Today</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => {
                    setLocalDate("tomorrow");
                }}>
                    <div className={clsx(
                        "item",
                        localDate === "tomorrow" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>Tomorrow</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => {
                    setLocalDate("this-weekend");
                }}>
                    <div className={clsx(
                        "item",
                        localDate === "this-weekend" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>This Weekend</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => {
                    setLocalDate("custom");
                }}>
                    <div className={clsx(
                        "item",
                    )}>
                        <div className="in">
                            <div className="custom-date-range mt-2  w-full">
                                <div className={clsx(
                                    "mb-1",
                                    localDate === "custom" ? "text-theme-primary" : ""
                                )}>Custom Date</div>

                                {localDate === "custom" && (
                                    <div className="form-group basic horizontal">
                                        <div className="input-wrapper">
                                            <div className="row align-items-center">

                                                <div className="mb-2">
                                                    <div className="input-wrapper">
                                                        <DatePicker
                                                            label="Date From"
                                                            variant='underlined'
                                                            onChange={(date) => {
                                                                setLocalCustomDateRange({
                                                                    start: date.toString(),
                                                                    end: customDateRange?.end || null
                                                                });
                                                            }}
                                                            minValue={today(getLocalTimeZone())}
                                                            defaultValue={customDateRange?.start ? parseDate(customDateRange.start) : today(getLocalTimeZone())}
                                                            name={'dateFrom'}
                                                            fullWidth
                                                            selectorIcon={<IonIcon icon={calendarOutline} role="img" className="md hydrated" aria-label="calendar outline" />}
                                                        />
                                                        <label className="form-label"></label>
                                                        <i className="clear-input">
                                                            <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                                        </i>
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <div className="input-wrapper">
                                                        <label className="form-label"></label>
                                                        <DatePicker
                                                            variant='underlined'
                                                            label="Date To"
                                                            showMonthAndYearPickers
                                                            defaultValue={customDateRange?.end ? parseDate(customDateRange.end) : null}
                                                            onChange={(date) => {
                                                                setLocalCustomDateRange({
                                                                    start: customDateRange?.start || null,
                                                                    end: date.toString()
                                                                });
                                                            }}
                                                            minValue={today(getLocalTimeZone())}
                                                            name={'dateTo'}
                                                            fullWidth
                                                            selectorIcon={<IonIcon icon={calendarOutline} role="img" className="md hydrated" aria-label="calendar outline" />}
                                                        />
                                                        <i className="clear-input">
                                                            <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <div className="form-button-group">
                <button type="submit" className="btn btn-primary btn-block btn-lg !text-medium" onClick={onApply}>Apply Filters</button>
            </div>
        </div>
    );
};

const LocationFilter: React.FC<{
    onComplete: () => void;
}> = ({ onComplete }) => {
    const { locationFilter, customLocation, onLocationFilterChange } = useDiscoverFilters();
    const [location, setLocation] = useState<DiscoverFilterContextType['locationFilter']>(locationFilter);

    const onApply = () => {
        onLocationFilterChange(location);
        onComplete();
    };

    return (
        <div className="filter-panel w-full">
            <div className="form-group boxed px-2">
                <div className="input-wrapper">
                    <label className="form-label" htmlFor="name5">Location</label>
                    <input type="text" className="form-control" id="name5" placeholder="Enter location" autoComplete="off" />
                    <i className="clear-input">
                        <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                    </i>
                </div>
            </div>

            <ul className="listview image-listview text mt-3">
                <li onClick={() => setLocation('near-me')}>
                    <div className={clsx(
                        "item",
                        location === "near-me" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>Nearby</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => setLocation('national')}>
                    <div className={clsx(
                        "item",
                        location === "national" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>National</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => setLocation('25-miles')}>
                    <div className={clsx(
                        "item",
                        location === "25-miles" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>25 Miles</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => setLocation('50-miles')}>
                    <div className={clsx(
                        "item",
                        location === "50-miles" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>50 Miles</div>
                        </div>
                    </div>
                </li>
                <li onClick={() => setLocation('100-miles')}>
                    <div className={clsx(
                        "item",
                        location === "100-miles" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>100 Miles</div>
                        </div>
                    </div>
                </li>

            </ul>

            <div className="form-button-group">
                <button type="submit" className="btn btn-primary btn-block btn-lg" onClick={onApply}>Apply Filters</button>
            </div>
        </div>
    );
};

const CategoryFilter: React.FC<{
    onComplete: () => void;
}> = ({ onComplete }) => {
    const { categoryFilter, onCategoryFilterChange, categories } = useDiscoverFilters();
    const [localCategory, setLocalCategory] = useState<DiscoverFilterContextType['categoryFilter']>(categoryFilter);

    const onApply = () => {
        onCategoryFilterChange(localCategory);
        onComplete();
    };

    return (
        <div className="filter-panel h-full">
            <ul className="listview image-listview text mt-3 !border-none">
                <li onClick={() => setLocalCategory('all')}>
                    <div className={clsx(
                        "item",
                        localCategory === "all" ? "active" : ""
                    )}>
                        <div className="in">
                            <div>All</div>
                        </div>
                    </div>
                </li>

                {/* if length of categories is 0, show skeleton */}
                {categories.length === 0 && Array.from({ length: 5 }).map((_, index) => (
                    <li key={index}>
                        <div className="w-3/4 bg-gray-200 h-7 rounded-sm mx-3 mb-3">
                            <div className="in bg-slate-400 animate-pulse" />
                        </div>
                    </li>
                ))}

                {categories.map((category, index) => (
                    <li key={index} onClick={() => setLocalCategory(category.slug)}>
                        <div className={clsx(
                            "item",
                            localCategory === category.slug ? "active" : ""
                        )}>
                            <div className="in">
                                <div dangerouslySetInnerHTML={{
                                    __html: category.name
                                }} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="form-button-group">
                <button type="submit" className="btn btn-primary btn-block btn-lg" onClick={onApply}>Apply Filters</button>
            </div>
        </div>
    );
};

const DiscoverFilterModal: React.FC<{ type: string | null; onComplete: () => void; }> = ({ type, onComplete }) => {
    const renderModalContent = () => {
        switch (type) {
            case "date":
                return <DateFilter onComplete={onComplete} />;
            case "category":
                return <CategoryFilter onComplete={onComplete} />;
            case "location":
                return <LocationFilter onComplete={onComplete} />;
            default:
                return null;
        }
    };

    return renderModalContent();
};

interface DiscoverFiltersProps {
    defaultLocation?: string;
    type: 'events' | 'venues' | 'users';
}

export const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
    defaultLocation,
    type
}) => {
    const { dateFilter, customDateRange, locationFilter, customLocation, categoryFilter, setCategoryType, categories } = useDiscoverFilters();

    useEffect(() => {
        setCategoryType(type);
    }, [type]);

    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const renderTitle = () => {
        switch (activeFilter) {
            case "date":
                return "Filter by Date";
            case "category":
                return "Filter by Category";
            case "location":
                return "Filter by Location";
            default:
                return "Discover";
        }
    };

    const renderDateTitle = () => {
        switch (dateFilter) {
            case "anytime":
                return "Date";
            case "today":
                return "Today";
            case "tomorrow":
                return "Tomorrow";
            case "this-weekend":
                return "This Weekend";
            case "custom":
                return formatFilterDate(customDateRange?.start || today(getLocalTimeZone()).toString(), customDateRange?.end || null);
            default:
                return "Anytime";
        }
    };

    const renderLocationTitle = () => {
        switch (locationFilter) {
            case "near-me":
                return defaultLocation || "Nearby";
            case "national":
                return "National";
            case "25-miles":
                return "25 Miles";
            case "50-miles":
                return "50 Miles";
            case "100-miles":
                return "100 Miles";
            case "custom":
                return customLocation || "Custom Location";
            default:
                return "Nearby";
        }
    };

    const renderCategoryTitle = () => {
        if (categoryFilter === "all") {
            return "Categories";
        }

        const category = categories.find(category => category.slug === categoryFilter);

        return <div dangerouslySetInnerHTML={{
            __html: category?.name
        }} /> || "Categories";
    };

    return (
        <div className="overflow-x-scroll w-full">
            <div className="filter-bar flex  overflow-x-scroll mt-1 w-full pb-1">
                <div className={clsx(
                    "filter-item flex items-center gap-1 min-w-fit",
                    dateFilter !== "anytime" ? "active" : ""
                )}
                    onClick={() => {
                        setActiveFilter("date");
                    }}
                >
                    <IonIcon
                        icon={calendarOutline}
                        role="img"
                        className="md hydrated mr-1 text-medium"
                        aria-label="calendar outline"
                    />
                    {renderDateTitle()}
                    <IonIcon
                        icon={caretDownOutline}
                        role="img"
                        className="md hydrated"
                        aria-label="caret down outline"
                    />
                </div>

                <div className={clsx(
                    "filter-item flex items-center gap-1 min-w-fit",
                    locationFilter !== "near-me" ? "active" : ""
                )}
                    onClick={() => {
                        setActiveFilter("location");
                    }}
                >
                    <IonIcon
                        icon={locationOutline}
                        role="img"
                        className="md hydrated mr-1 text-medium"
                        aria-label="calendar outline"
                    />
                    {renderLocationTitle()}
                    <IonIcon
                        icon={caretDownOutline}
                        role="img"
                        className="md hydrated"
                        aria-label="caret down outline"
                    />
                </div>

                <div className={clsx(
                    "filter-item flex items-center gap-1 min-w-fit",
                    categoryFilter !== "all" ? "active" : ""
                )}
                    onClick={() => {
                        setActiveFilter("category");
                    }}
                >
                    <IonIcon icon={pieChartOutline} role="img" className="md hydrated mr-1 text-medium" aria-label="calendar outline" />
                    {renderCategoryTitle()}
                    <IonIcon
                        icon={caretDownOutline}
                        role="img"
                        className="md hydrated"
                        aria-label="caret down outline"
                    />
                </div>

                <SlideInFromBottomToTop
                    stickyScroll
                    isOpen={activeFilter !== null}
                    onClose={() => setActiveFilter(null)}
                    height={'70%'}
                    title={renderTitle()}
                    className={clsx(
                        activeFilter === 'category' && 'h-full'
                    )}
                >
                    <NextUIProvider className="w-full px-2">
                        <DiscoverFilterModal type={activeFilter} onComplete={() => setActiveFilter(null)} />
                    </NextUIProvider>
                </SlideInFromBottomToTop>
            </div>
        </div>

    );

};