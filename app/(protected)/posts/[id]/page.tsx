const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <div className="">
            View post {params.id}
        </div>
    );
};

export default Page;