import { fetchEvent } from '@/actions/home-actions';
import { ViewEvent } from '@/components/Home/ViewPost';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';

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