'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import { getEventCategories } from "@/actions/home-actions";

export interface DiscoverFilterContextType {
    dateFilter: 'anytime' | 'today' | 'tomorrow' | 'this-week' | 'this-weekend' | 'custom';
    customDateRange?: {
        start: string | null;
        end: string | null;
    } | null;
    locationFilter: 'near-me' | 'national' | '25-miles' | '50-miles' | '100-miles' | 'custom';
    customLocation?: string | null;
    categoryFilter?: string | null;
    // Actions
    onDateFilterChange: (filter: DiscoverFilterContextType['dateFilter'], customRange?: DiscoverFilterContextType['customDateRange']) => void;
    onLocationFilterChange: (filter: DiscoverFilterContextType['locationFilter'], customLocation?: DiscoverFilterContextType['customLocation']) => void;
    onCategoryFilterChange: (category: DiscoverFilterContextType['categoryFilter']) => void;
    setCategoryType: (type: 'events' | 'venues' | 'users' | null) => void;
    categories: any[];
}

interface DefaultCategoryType {
    id: number;
    name: string;
    slug: string;
}

const DiscoverFilterContext = createContext<DiscoverFilterContextType | undefined>(undefined);

const DiscoverFilterProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const [dateFilter, setDateFilter] = useState<DiscoverFilterContextType['dateFilter']>('anytime');
    const [customDateRange, setCustomDateRange] = useState<DiscoverFilterContextType['customDateRange']>({
        start: today(getLocalTimeZone()).toString(),
        end: null,
    });
    const [locationFilter, setLocationFilter] = useState<DiscoverFilterContextType['locationFilter']>('near-me');
    const [customLocation, setCustomLocation] = useState<DiscoverFilterContextType['customLocation']>(null);
    const [categoryFilter, setCategoryFilter] = useState<DiscoverFilterContextType['categoryFilter']>('all');
    const [categoryType, setCategoryType] = useState<'events' | 'venues' | 'users' | null>(null);
    const [categories, setCategories] = useState<DefaultCategoryType[]>([]);

    const { data } = useQuery<DefaultCategoryType[], Error>({
        queryKey: ["categories", categoryType],
        queryFn: () => {
            if (categoryType === 'events') {
                return getEventCategories();
            }

            return getEventCategories();
        },
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: categoryType !== null,
    });

    useEffect(() => {
        if (categories.length > 0) return;

        if (data && data.length > 0) {
            setCategories(data);
        }
    }, [data]);

    const onDateFilterChange = (filter: DiscoverFilterContextType['dateFilter'], customRange?: DiscoverFilterContextType['customDateRange']) => {
        setDateFilter(filter);

        if (customRange) {
            setCustomDateRange(customRange);
        }
    };

    const onLocationFilterChange = (filter: DiscoverFilterContextType['locationFilter'], customLocation?: DiscoverFilterContextType['customLocation']) => {
        setLocationFilter(filter);

        if (customLocation) {
            setCustomLocation(customLocation);
        }
    };

    const onCategoryFilterChange = (category: DiscoverFilterContextType['categoryFilter']) => {
        setCategoryFilter(category);
    };


    const contextValues: DiscoverFilterContextType = {
        dateFilter,
        customDateRange,
        locationFilter,
        customLocation,
        categoryFilter,
        onDateFilterChange,
        onLocationFilterChange,
        onCategoryFilterChange,
        setCategoryType,
        categories,
    };

    return (
        <DiscoverFilterContext.Provider value={contextValues}>
            {children}
        </DiscoverFilterContext.Provider>
    );
};

const useDiscoverFilters = () => {
    const context = useContext(DiscoverFilterContext);
    if (context === undefined) {
        throw new Error('useDiscoverFilters must be used within a DiscoverFilterProvider');
    }
    return context;
};

export { DiscoverFilterContext, DiscoverFilterProvider, useDiscoverFilters };
