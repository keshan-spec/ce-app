import { fetchPosts } from '@/api-functions/posts';
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import dynamic from 'next/dynamic';


const ProtectedLayout = dynamic(() => import('@/app/(protected)/layout'));
const Posts = dynamic(() => import('@/components/Posts/Posts'), { ssr: false });
const ObservedQueryProvider = dynamic(() => import('@/app/context/ObservedQuery'));

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
