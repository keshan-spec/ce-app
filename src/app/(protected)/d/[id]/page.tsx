import NcImage from "@/components/Image/Image";

const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <div>
            <h1>Page {params.id}</h1>
            <NcImage src="https://via.placeholder.com/150" alt="placeholder" />
        </div>
    );
};

export default Page;