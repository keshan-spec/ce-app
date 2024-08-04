import { fetchPost } from "@/api-functions/posts";
import { EditPost } from "@/components/CreatePost/EditPost";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const Page = async ({ params }: { params: { id: string; }; }) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['view-post', params.id],
        queryFn: () => fetchPost(params.id),
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EditPost post_id={params.id} />
        </HydrationBoundary>
    );
};

export default Page;