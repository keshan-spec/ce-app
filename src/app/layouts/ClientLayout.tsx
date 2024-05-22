'use client';
import { ReactQueryDevtools } from 'react-query/devtools';

import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient();

export const ClientLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};