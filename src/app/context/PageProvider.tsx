'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface PageContextProps {
    activePage: string;
    setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

// Create a context
const PageContext = createContext<PageContextProps | undefined>(undefined);

// Create a provider component
export const PageProvider = ({ children }: { children: React.ReactNode; }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [activePage, setActivePage] = useState('home');

    // add the activepage to the url as a query param
    useEffect(() => {
        if (activePage !== 'home') {
            router.push(`?cur-p=${activePage}`, {
                scroll: false,
            });
        }
    }, [activePage]);

    // everytime search param changes and the page is refreshed, set the active page
    useEffect(() => {
        if (searchParams.has('cur-p')) {
            const curPage = searchParams.get('cur-p');

            if (curPage && curPage !== activePage) {
                setActivePage(curPage);
            }
        }
    }, [searchParams,]);

    return (
        <PageContext.Provider value={{ activePage, setActivePage }}>
            {children}
        </PageContext.Provider>
    );
};

// Custom hook to use the PageContext
export const usePage = () => {
    const context = useContext(PageContext);

    if (!context) {
        throw new Error('usePage must be used within a PageProvider');
    }

    return context;
};
