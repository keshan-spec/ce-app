import { Metadata } from "next";
import dynamic from 'next/dynamic';

const ProtectedLayout = dynamic(() => import('@/app/(protected)/layout'));
const Posts = dynamic(() => import('@/components/Posts/Posts'), { ssr: false });
const ObservedQueryProvider = dynamic(() => import('@/app/context/ObservedQuery'));

export const metadata: Metadata = {
  title: 'Social | Drive Life',
  description: 'Social Feed',
  openGraph: {
    type: 'article',
    siteName: 'Drive Life',
  },
};

const Page = async () => {
  return (
    <ProtectedLayout>
      <ObservedQueryProvider>
        <Posts />
      </ObservedQueryProvider>
    </ProtectedLayout>
  );
};

export default Page;
