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