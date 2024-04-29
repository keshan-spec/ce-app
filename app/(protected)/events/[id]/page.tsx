
const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <div>
            <h1>Event Page</h1>
            <p>Event ID: {params.id}</p>
        </div>
    );
};

export default Page;