import { ProfileLayout } from "@/components/Profile/ProfileLayout";

const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <div className="relative min-h-[150dvh]">
            <ProfileLayout currentUser={false} profileId={params.id} />
        </div>
    );
};

export default Page;