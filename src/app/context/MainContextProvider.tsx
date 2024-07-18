'use client';
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface MainContextType {
    setHeaderAction: (callback: () => void) => void;
    setTopTabs: (tabs: ReactNode) => void;
    renderTopTabs: () => ReactNode | undefined;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

const MainProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const pathname = usePathname();
    const [headerAction, setHeaderAction] = useState<() => void>(() => () => { });
    const [topTabs, setTopTabs] = useState<ReactNode | undefined>(undefined);

    // useEffect(() => {
    //     // reset header action when the pathname changes
    //     setHeaderAction(() => () => { });
    //     setTopTabs(undefined);
    // }, [pathname]);

    const contextValues: MainContextType = {
        setHeaderAction,
        renderTopTabs: () => topTabs,
        setTopTabs,
    };

    return (
        <MainContext.Provider value={contextValues}>
            {children}
        </MainContext.Provider>
    );
};

const useSharedContext = () => {
    const context = useContext(MainContext);
    if (context === undefined) {
        throw new Error('useSharedContext must be used within a MainProvider');
    }
    return context;
};

export { MainContext, MainProvider, useSharedContext };