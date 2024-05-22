import { ProfileLayout } from "@/components/Profile/ProfileLayout";

const Page = () => {
    return (
        <div className="relative min-h-[150dvh]">
            <ProfileLayout currentUser={true} />
        </div>
    );
};

export default Page;