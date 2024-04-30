export const formatEventDate = (date: string): string => {
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };

    return eventDate.toLocaleDateString('en-US', options);
};

export const formatPostDate = (date: string) => {
    // format to relative time, like less than a minute ago, 1 minute ago, 1 hour ago, etc.
    const postDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const seconds = timeDifference / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    const years = months / 12;

    if (seconds < 60) {
        return `${Math.floor(seconds)} seconds ago`;
    } else if (minutes < 60) {
        return `${Math.floor(minutes)} minutes ago`;
    } else if (hours < 24) {
        return `${Math.floor(hours)} hours ago`;
    } else if (days < 30) {
        return `${Math.floor(days)} days ago`;
    } else if (months < 12) {
        return `${Math.floor(months)} months ago`;
    } else {
        return `${Math.floor(years)} years ago`;
    }
};