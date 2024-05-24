import NcImage from "@/components/Image/Image";
import Image from "next/image";

const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <div>
            <h1>Page {params.id}</h1>
            <Image src="https://via.placeholder.com/150" alt="placeholder" width={150} height={150} />
        </div>
    );
};

export default Page;