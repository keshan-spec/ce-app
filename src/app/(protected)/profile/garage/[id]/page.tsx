import { Metadata, ResolvingMetadata } from "next";

import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';
import { getGarageById } from "@/actions/garage-actions";
import { GarageView } from "@/components/Profile/Garage/GarageView";

type Props = {
    params: { id: string; };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const data = await getGarageById(params.id);
    const previousImages = (await parent).openGraph?.images || [];

    let description = 'User Garage';
    let title = `Garage | Drive Life`;

    if (data) {
        title = `@${data.owner?.username}'s ${data.make} ${data.model} | Drive Life`;
        description = data.short_description;
    }

    return {
        title,
        description,
        keywords: `garage, ${data?.make}, ${data?.model}, ${data?.owner?.username}`,
        openGraph: {
            images: [
                ...previousImages,
                {
                    url: data?.cover_photo || '',
                    alt: `Cover photo for ${data?.make} ${data?.model}`,
                }
            ],
            type: 'profile',
            siteName: 'Drive Life',
        },
    };
}

const Page = async ({ params }: { params: { id: string; }; }) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['view-garage', params.id],
        queryFn: () => getGarageById(params.id),
    });

    return (
        <div className="relative min-h-[150dvh]">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <GarageView garageId={params.id} />
            </HydrationBoundary>
        </div>
    );
};

export default Page;