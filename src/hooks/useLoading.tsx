import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const IMPORTANT_ROUTES = [
    '/discover',
    '/store',
    '/profile',
    '/profile/edit',
];

const useLoading = () => {
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const router = useRouter();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            let target = event.target as HTMLAnchorElement;

            // Traverse up the DOM tree to find the nearest <a> tag
            while (target && target.tagName !== 'A') {
                target = target.parentElement as HTMLAnchorElement;
            }

            // Check if we found an <a> tag
            if (target && target.tagName === 'A') {
                // Check if the href is not the same as the current location
                const href = (target as HTMLAnchorElement).href;
                if (href !== window.location.href && href.indexOf('#') === -1) {
                    // split the href to get the pathname 
                    // split by first / to get the pathname
                    const pathname = target.pathname;
                    console.log('Pathname> ', pathname);
                    router.prefetch(pathname);

                    setNextPage(pathname);
                    setLoading(true);
                }
            }
        };

        document.addEventListener('click', handleLinkClick);

        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    const handlePageLoad = useCallback(() => {
        // Assume that page load is completed when the spinner should be hidden
        setLoading(false);
        // setSkeleton(null);
    }, [loading]);

    useEffect(() => {
        handlePageLoad();
    }, [pathname, searchParams]);

    return {
        loading,
        nextPage,
    };
};

export default useLoading;