import ProtectedLayout from "./(protected)/layout";

import { ObservedQueryProvider } from "@/app/context/ObservedQuery";
import { Posts } from "@/components/Posts/Posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Social | Drive Life',
  description: 'Social Feed',
  openGraph: {
    type: 'article',
    siteName: 'Drive Life',
  },
};

const Page = () => {
  return (
    <ProtectedLayout>
      <ObservedQueryProvider>
        <Posts />
      </ObservedQueryProvider>
    </ProtectedLayout>
  );
};

export default Page;
