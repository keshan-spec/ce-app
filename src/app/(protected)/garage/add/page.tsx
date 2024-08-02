import { Metadata } from "next";
import dynamic from "next/dynamic";

const AddVehicle = dynamic(() => import('@/components/Profile/Garage/AddVehicle'), { ssr: false });

export const metadata: Metadata = {
    title: 'Add Vehicle | Drive Life',
    description: 'Add a vehicle to your garage to showcase it and share it with the community.',
    openGraph: {
        type: 'article',
        siteName: 'Drive Life',
    },
};

const Page = () => {
    return (
        <AddVehicle />
    );
};

export default Page;