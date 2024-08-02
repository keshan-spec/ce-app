import { getUserNotifications } from "@/actions/notification-actions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const UserNotifications = dynamic(() => import('@/components/Notifications/Notifications'));

export const metadata: Metadata = {
    title: "Notifications",
    description: "Notifications page",
};

const queryClient = new QueryClient();

const Page = async () => {
    await queryClient.prefetchQuery({
        queryKey: ["user-notifications"],
        queryFn: () => getUserNotifications(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UserNotifications />
        </HydrationBoundary>
    );
};

export default Page;