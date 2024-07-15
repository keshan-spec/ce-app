import { AddVehicle } from "@/components/Profile/Garage/AddVehicle";
import { Metadata } from "next";

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