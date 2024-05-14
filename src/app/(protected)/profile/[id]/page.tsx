const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <div className="">
            View user {params.id}
        </div>
    );
};

export default Page;