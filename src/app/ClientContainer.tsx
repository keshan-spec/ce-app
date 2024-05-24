"use client";

export const ClientContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div suppressHydrationWarning={true}>
            {children}
        </div>
    );
};