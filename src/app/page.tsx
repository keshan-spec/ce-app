import ProtectedLayout from "./(protected)/layout";
import { ObservedQueryProvider } from "@/app/context/ObservedQuery";
// import Posts from "@/components/Posts/Posts";
import { Metadata } from "next";
import React from "react";

const Posts = React.lazy(() => import('@/components/Posts/Posts'));

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
