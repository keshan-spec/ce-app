import { fetchPosts } from "@/actions/post-actions";
import ProtectedLayout from "./(protected)/layout";
import { ObservedQueryProvider } from "@/app/context/ObservedQuery";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import React from "react";
import dynamic from 'next/dynamic';

const Posts = dynamic(() => import('@/components/Posts/Posts'));

export const metadata: Metadata = {
  title: 'Social | Drive Life',
  description: 'Social Feed',
  openGraph: {
    type: 'article',
    siteName: 'Drive Life',
  },
};

const queryClient = new QueryClient();

const Page = async () => {
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['latest-posts'],
    queryFn: ({ pageParam }) => {
      return fetchPosts(pageParam || 1, false);
    },
    initialPageParam: 1,
  });

  return (
    <ProtectedLayout>
      <ObservedQueryProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Posts />
        </HydrationBoundary>
      </ObservedQueryProvider>
    </ProtectedLayout>
  );
};

export default Page;
