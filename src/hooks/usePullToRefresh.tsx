import { useEffect, useState } from "react";

export const usePullToRefresh = () => {
    const [pullEnabled, setPullEnabled] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setPullEnabled(true);
            } else {
                setPullEnabled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return pullEnabled;
};