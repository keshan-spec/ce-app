'use client';
import { EditPostProvider } from '@/app/context/EditPostProvider';
import { PostEditSharePanel } from './CreatePost';
import { useRouter } from 'next/navigation';

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