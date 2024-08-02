import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Cart | Drive Life',
    description: 'Drive Life Cart',
    openGraph: {
        type: 'website',
        siteName: 'Drive Life',
    },
};

const Cart = dynamic(() => import('@/components/Store/Cart'));

const Page = () => {
    return (
        <Cart />
    );
};

export default Page;