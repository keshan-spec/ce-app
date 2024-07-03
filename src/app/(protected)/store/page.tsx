import { StoreTabs } from "@/components/Store/StoreTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Store | Drive Life',
    description: 'Drive Life Store',
    openGraph: {
        type: 'website',
        siteName: 'Drive Life',
    },
};

export default function Page() {
    return (
        <StoreTabs />
    );
}