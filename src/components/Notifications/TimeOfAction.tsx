"use client";

import { Notification } from "@/types/notifications";

interface TimeOfActionProps {
    date: string;
}

const TimeOfAction = ({ date }: TimeOfActionProps) => {
    const current = new Date();
    const actionDate = new Date(date);
    const seconds = Math.floor((current.getTime() - actionDate.getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 1) {
        return <div>{weeks} weeks ago</div>;
    } else if (weeks === 1) {
        return <div>{weeks} week ago</div>;
    } else if (days > 1) {
        return <div>{days} days ago</div>;
    } else if (days === 1) {
        return <div>{days} day ago</div>;
    } else if (hours >= 1) {
        return <div>{hours}h ago</div>;
    } else if (mins >= 1) {
        return <div>{mins}m ago</div>;
    } else {
        return <div>{seconds}s ago</div>;
    }
};

export default TimeOfAction;
