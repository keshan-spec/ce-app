'use client';
import { usePathname } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import { getQueryClient } from "../../context/QueryClientProvider";

// import PullToRefresh from 'react-simple-pull-to-refresh';
import dynamic from "next/dynamic";
const PullToRefresh = dynamic(() => import('react-simple-pull-to-refresh'), { ssr: false });

const queryClient = getQueryClient();

export default function PullToRefreshContext({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const allowPullToRefresh = () => {
        if (pathname.includes('/checkout') || pathname.includes('/checkout/payment-success')
            || pathname.includes('/profile/edit/') || pathname.includes('/discover')
        ) {
            return false;
        }

        return true;
    };

    const handleRefresh = async () => {
        await queryClient.resetQueries();
    };

    return (
        <PullToRefresh
            onRefresh={handleRefresh}
            resistance={true ? 3 : 1}
            pullDownThreshold={100}
            maxPullDownDistance={110}
            className="w-full h-full overflow-auto"
            isPullable={true && allowPullToRefresh()}
            pullingContent={
                <div className="text-center flex items-center text-black w-full mt-2">
                    <BiLoader className="text-3xl w-full" />
                </div>
            }
            refreshingContent={
                <div className="text-center flex items-center text-black w-full mt-2">
                    <BiLoader className="text-3xl animate-spin w-full" />
                </div>
            }
        >
            <>
                {children}
            </>
        </PullToRefresh>
    );
}
