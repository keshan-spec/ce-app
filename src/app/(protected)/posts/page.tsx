import { ObservedQueryProvider } from "@/app/context/ObservedQuery";
import { Posts } from "@/components/Posts/Posts";

const Page = () => {
    return (
        <ObservedQueryProvider>
            <Posts />
        </ObservedQueryProvider>
    );
};

export default Page;