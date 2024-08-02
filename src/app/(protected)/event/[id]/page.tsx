import React from 'react';
import { fetchEvent } from '@/actions/home-actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

const ViewEvent = dynamic(() => import('@/components/Home/ViewEvent'), { ssr: false });

const Page = async ({ params }: { params: { id: string; }; }) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['event', params.id],
        queryFn: () => fetchEvent(params.id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ViewEvent eventId={params.id} key={params.id} />
        </HydrationBoundary>
    );
};

export default Page;