import { getGarageById } from '@/api-functions/garage';
import { EditGarage } from '@/components/Profile/Garage/EditGarage/EditGarage';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Garage | Drive Life',
    description: 'Edit your garage to showcase your vehicles and share them with the community.',
    openGraph: {
        type: 'article',
        siteName: 'Drive Life',
    },
};

const Page = async ({ params }: { params: { garage_id: string; }; }) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['edit-garage', params.garage_id],
        queryFn: () => getGarageById(params.garage_id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EditGarage garage_id={params.garage_id} key={params.garage_id} />
        </HydrationBoundary>
    );
};

export default Page;