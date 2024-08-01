import { getUserNotifications } from "@/actions/notification-actions";
import UserNotifications from "@/components/Notifications/Notifications";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notifications",
    description: "Notifications page",
};

const queryClient = new QueryClient();

const Page = async () => {
    await queryClient.prefetchQuery({
        queryKey: ["user-notifications"],
        queryFn: () => getUserNotifications(),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UserNotifications />
        </HydrationBoundary>
    );
};

export default Page;