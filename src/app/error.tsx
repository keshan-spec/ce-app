'use client';
import { Button } from "@/shared/Button";
import Link from "next/link";

// Error components must be Client Components

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    const renderErrorMessage = () => {
        if (error.message.includes('Network Error')) {
            return (
                <p>
                    It seems there is a network issue. Please check your internet connection and try again.
                </p>
            );
        } else if (error.message.includes('404')) {
            return (
                <p>
                    The page you are looking for could not be found. Please check the URL or go back to the{' '}
                    <a href="/">homepage</a>.
                </p>
            );
        } else if (error.message.includes('500')) {
            return (
                <p>
                    There seems to be a server error. Please try again later or contact our support team.
                </p>
            );
        } else {
            return (
                <p>
                    An unexpected error occurred. Please try again later. If this issue persists, please contact our support team or{' '}
                    <Link href="https://github.com/keshan-spec/ce-app/issues" target="_">
                        report the issue
                    </Link>.
                </p>
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[100vh] w-full px-8">
            <h1 className="text-3xl font-bold text-center">Oops! {error.message}</h1>
            <div className="text-center">
                {renderErrorMessage()}
            </div>
            <Button
                className="mt-4 bg-theme-primary text-white px-4 py-2 rounded-md"
                onClick={reset}
            >
                Reload
            </Button>
        </div>
    );
}