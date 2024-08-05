import { Metadata, ResolvingMetadata } from "next";

import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';
import dynamic from "next/dynamic";
import { getStoreProduct } from "@/api-functions/store";

const ViewProduct = dynamic(() => import('@/components/Store/ViewProduct'), { ssr: false });

type Props = {
    params: { id: number; };
};

// export async function generateMetadata(
//     { params }: Props,
//     parent: ResolvingMetadata
// ): Promise<Metadata> {
//     // read route params
//     const id = params.id;
//     const product = await getStoreProduct(id);
//     const previousImages = (await parent).openGraph?.images || [];

//     let title: string = 'Product';
//     let image: string;
//     let description = '';

//     if (!product) {
//         title = 'Product Not Found';
//         image = '';
//     } else {
//         if (product.success) {
//             title = product.data?.title || 'Product';
//         }

//         image = product.data?.thumb || '';
//         description = product.data?.highlight || '';
//     }

//     return {
//         title: `${title} | Drive Life`,
//         description,
//         openGraph: {
//             images: [
//                 ...previousImages,
//                 { url: image },
//             ],
//             siteName: 'Drive Life',
//         },
//     };
// }

const queryClient = new QueryClient();

const Page = async ({ params }: { params: { id: number; }; }) => {
    await queryClient.prefetchQuery({
        queryKey: ['view-product', params.id],
        queryFn: () => getStoreProduct(params.id),
    });

    return (
        <div className="relative h-full">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ViewProduct id={params.id} />
            </HydrationBoundary>
        </div>
    );
};

export default Page;