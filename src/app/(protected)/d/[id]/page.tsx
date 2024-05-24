import dynamic from 'next/dynamic';

const NcImage = dynamic(() => import('@/components/Image/Image'), { ssr: false });

const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <div>
            <h1>Page {params.id}</h1>
            <NcImage src="https://via.placeholder.com/150" alt="placeholder" width={150} height={150} />
        </div>
    );
};

export default Page;