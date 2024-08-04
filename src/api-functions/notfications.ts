
export const getUserNotifications = async () => {
    const response = await fetch(`/api/notifications/user-notfications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data;
};

export const getNotificationCount = async () => {
    const response = await fetch(`/api/notifications/new-notifications-count`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data;
};