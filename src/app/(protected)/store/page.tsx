import { getStoreProducts } from "@/actions/store-actions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import React from "react";

const Products = React.lazy(() => import('@/components/Store/Products'));
const UserOrders = React.lazy(() => import('@/components/Store/UserOrders'));

export const metadata: Metadata = {
    title: 'Store | Drive Life',
    description: 'Drive Life Store',
    openGraph: {
        type: 'website',
        siteName: 'Drive Life',
    },
};

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['store-products'],
        queryFn: ({ pageParam }) => getStoreProducts(pageParam || 1),
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="section full">
                <div className="home-tabs-wrapper">
                    <div className="tab-content">
                        <Products />
                        <UserOrders />
                    </div>
                </div>
            </div>
        </HydrationBoundary>
    );
}