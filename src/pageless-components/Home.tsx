import dynamic from 'next/dynamic';

const Posts = dynamic(() => import('@/components/Posts/Posts'), { ssr: false });
const ObservedQueryProvider = dynamic(() => import('@/app/context/ObservedQuery'));

const HomePage = () => {
    return (
        <ObservedQueryProvider>
            <Posts />
        </ObservedQueryProvider>
    );
};

export default HomePage;