import UserNotifications from "@/components/Notifications/Notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notifications",
    description: "Notifications page",
};

const Page = () => {
    return (
        <UserNotifications />
    );
};

export default Page;