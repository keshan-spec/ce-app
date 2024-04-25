"use server";

export const fetchTrendingEvents = async () => {
    const response = await fetch("https://wordpress-889362-4267074.cloudwaysapps.com/wp-json/app/v1/get-trending-events", {
        cache: "no-cache"
    });
    const data = await response.json();
    return data;
};