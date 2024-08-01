"use server";

import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";

export const getUserNotifications = async () => {
    const user = await getSessionUser();
    if (!user) return null;

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-notifications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
    });

    const data = await response.json();
    return data;
};

export const getNotificationCount = async () => {
    const user = await getSessionUser();
    if (!user) return null;

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-new-notifications-count`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
    });

    const data = await response.json();
    return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
    const user = await getSessionUser();
    if (!user) return null;

    const response = await fetch(`${API_URL}/wp-json/app/v1/mark-notification-read`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, notification_id: notificationId }),
    });

    const data = await response.json();
    return data;
};

export const markMultipleNotificationsAsRead = async (notificationIds: string[]) => {
    const user = await getSessionUser();
    if (!user) return null;

    const response = await fetch(`${API_URL}/wp-json/app/v1/bulk-notifications-read`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
    });

    const data = await response.json();
    return data;
};