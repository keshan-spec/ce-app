import { addComment, fetchPostComments } from "@/actions/post-actions";
import { useUser } from "@/hooks/useUser";
import { formatPostDate } from "@/utils/dateUtils";
import { IonIcon } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { chatbubbleOutline, heartOutline, reloadCircle } from "ionicons/icons";
import { useMemo, useState } from "react";
import { BiCommentAdd, BiLoader, BiRefresh } from "react-icons/bi";
// import { useQuery } from "react-query";

interface ComentsSectionProps {
    postId: number;
}

export const ComentsSection: React.FC<ComentsSectionProps> = ({
    postId
}) => {
    const { data, error, isFetching, isLoading, refetch } = useQuery<any[], Error>({
        queryKey: ["post-comments", postId],
        queryFn: () => {
            return fetchPostComments(postId);
        },
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        keepPreviousData: true,
    });

    const onNewComment = () => {
        refetch();
    };

    const minHeight = useMemo(() => {
        if (data && data.length > 0) {
            return `min-h-[${data.length * 50}vh]`;
        }

        return "min-h-[90vh]";
    }, [data]);

    return (
        <div className={clsx("w-full overflow-scroll h-full", minHeight)}>
            <div className="section full mb-3 w-full">
                {(isLoading || isFetching) && <CommentLoadingSkeleton />}
                {error && <p className="px-3">{error.message}</p>}
                {(data && data.length === 0 && !(isLoading || isFetching)) && (
                    <p className="px-3">No comments found</p>
                )}

                {data && data.length > 0 && (
                    <div className="comment-block mt-1">
                        {data.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                    </div>
                )}
            </div>
            <CommentForm postId={postId} onCommentAdded={onNewComment} />
        </div>
    );
};

const CommentForm: React.FC<{ postId: number; onCommentAdded: () => void; }> = ({ postId, onCommentAdded }) => {
    const { isLoggedIn, user } = useUser();

    if (!isLoggedIn) {
        return (
            <div className="absolute bottom-4 z-10 w-full inset-x-0 px-4">
                <p className="text-sm text-center text-gray-500">
                    Please login to post a comment
                </p>
            </div>
        );
    }

    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Add comment
            const response = await addComment(postId, comment);
            if (response) {
                setComment("");
                onCommentAdded();
            }
        } catch (error: any) {
            setError(error.message);
        }

        setLoading(false);
    };

    return (
        <div className="absolute bottom-0 z-10 w-full inset-x-0 bg-white">
            <form onSubmit={handleSubmit} className="flex items-start space-x-2 py-2">
                {/* <div className="w-8 h-8 bg-gray-300 rounded-full border-1 border-theme-primary mt-1">
                    {user?.profile_image && <img
                        src={user?.profile_image}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
                    />}
                </div> */}
                <div className="flex-1 space-y-1">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment"
                        className="w-full p-2 border rounded"
                    ></textarea>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-2 py-1 bg-theme-primary text-white rounded text-lg"
                        >
                            {loading ? <BiLoader className="animate-spin" /> : <BiCommentAdd />}
                        </button>
                        <IonIcon
                            icon={reloadCircle}
                            onClick={() => onCommentAdded()}
                            className={`text-3xl text-theme-primary cursor-pointer`}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const Comment: React.FC<{
    comment: {
        id: number;
        display_name: string;
        user_nicename: string;
        comment: string;
        comment_date: string;
        profile_image: string;
    };
}> = ({ comment }) => {
    return (
        <div className="item px-3 border-b border-b-gray-300 pb-2 !mb-3">
            <div className="avatar">
                <div className="w-8 h-8 bg-gray-300 rounded-full border-1 border-theme-primary mt-1">
                    {comment.profile_image && <img
                        src={comment.profile_image}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
                    />}
                </div>
            </div>
            <div className="in">
                <div className="comment-header">
                    <h4 className="title">
                        {comment.user_nicename}
                    </h4>
                    <span className="time">{formatPostDate(comment.comment_date)}</span>
                </div>
                <div className="text">
                    {comment.comment}
                </div>
                <div className="comment-footer">
                    <a href="#" className="comment-button">
                        <IonIcon icon={heartOutline} role="img" className="md hydrated" aria-label="heart outline" />
                        Like (523)
                    </a>
                    <a href="#" className="comment-button">
                        <IonIcon icon={chatbubbleOutline} role="img" className="md hydrated" aria-label="heart outline" />
                        Reply
                    </a>
                </div>
            </div>
        </div>
    );
};

const CommentLoadingSkeleton = () => {
    return (
        <div className="flex items-center space-x-2 my-4 px-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-1">
                <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
};