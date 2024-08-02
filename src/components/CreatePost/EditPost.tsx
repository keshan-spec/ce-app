'use client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const EditPostProvider = dynamic(() => import('@/app/context/EditPostProvider'), { ssr: false });
const PostEditSharePanel = dynamic(() => import('./CreatePost'), { ssr: false });

interface EditPostProps {
    post_id: string;
}

export const EditPost: React.FC<EditPostProps> = ({
    post_id
}) => {
    const router = useRouter();

    const onPostSuccess = () => {
        // Redirect to post detail page
        router.push(`/post/${post_id}`);
    };

    return (
        <EditPostProvider post_id={post_id}>
            <PostEditSharePanel onPostSuccess={onPostSuccess} />
        </EditPostProvider>
    );
};