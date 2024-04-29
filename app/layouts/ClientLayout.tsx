'use client';

import { ObservedQueryProvider } from '../context/ObservedQuery';
import { ReactQueryDevtools } from 'react-query/devtools';

import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import { useEffect } from 'react';


const queryClient = new QueryClient();

export const ClientLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ObservedQueryProvider>
                {children}
            </ObservedQueryProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};