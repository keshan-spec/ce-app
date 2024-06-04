'use client';
import { addComment, fetchPostComments, maybeLikeComment } from "@/actions/post-actions";
import { useUser } from "@/hooks/useUser";
import { formatPostDate } from "@/utils/dateUtils";
import { useQuery } from "@tanstack/react-query";
import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import { chatbubbleOutline, chevronUpCircleOutline, heart, heartOutline, reloadCircle } from "ionicons/icons";
import { useMemo, useState } from "react";
import { BiCommentAdd, BiLoader, BiRefresh } from "react-icons/bi";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
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
        // keepPreviousData: true,
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
    const { isLoggedIn } = useUser();

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
    const [rows, setRows] = useState(2);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading || comment.length === 0) return;

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
        <form onSubmit={handleSubmit} className="flex items-start space-x-2 py-2 min-h-11 bg-white">
            <div className="comments-container-footer">
                <div className="comment-submit-button">
                    <button
                        type="submit"
                        disabled={loading}>
                        {loading ? <BiLoader className="animate-spin" /> : <IonIcon
                            icon={chevronUpCircleOutline}
                            role="img"
                            className="md hydrated"
                            aria-label="chevron up circle outline"
                        />}
                    </button>
                </div>
                <textarea
                    className="form-control focus:ring-0 focus:outline-none !text-sm active:ring-0 active:outline-none"
                    rows={rows}
                    placeholder="Comment..."
                    spellCheck="false"
                    value={comment}
                    // onFocus={() => {
                    //     setRows(4);
                    // }}
                    // onBlur={() => {
                    //     setRows(2);
                    // }}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div id="toast-16" className={clsx(
                    "toast-box toast-bottom bg-danger",
                    error ? "show !bottom-0" : "bottom-full"
                )}>
                    <div className="in">
                        <div className="text">
                            {error}
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={loading || comment.length === 0}
                        className="btn btn-sm btn-text-light close-button"
                        onClick={() => setError(null)}
                    >
                        OK
                    </button>
                </div>
            </div>
        </form>
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
        likes_count: string | null;
        liked: boolean;
    };
}> = ({ comment }) => {
    const [likesCount, setLikesCount] = useState<number>(parseInt(comment.likes_count ?? '0'));
    const [liked, setLiked] = useState(comment.liked);
    const [error, setError] = useState<string | null>(null);

    const handleLike = async () => {
        const newLikedState = !liked;
        const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;

        // Optimistically update the UI
        setLiked(newLikedState);
        setLikesCount(newLikesCount);

        try {
            const responsne = await maybeLikeComment(comment.id);
            if (responsne) {
                comment.liked = newLikedState;
                comment.likes_count = newLikesCount.toString();
            }
        } catch (error: any) {
            // Revert the UI update if the API call fails
            setLiked(liked);
            setLikesCount(likesCount);
            setError(error.message);
            console.error("Failed to like comment:", error);
        }
    };

    return (
        <div className="item border-b border-b-gray-300 pb-2 !mb-3 overflow-hidden">
            <div id="toast-16" className={clsx(
                "toast-box toast-bottom bg-danger",
                error ? "show !bottom-0" : "bottom-full"
            )}>
                <div className="in">
                    <div className="text text-white">
                        {error}
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-sm btn-text-light close-button"
                    onClick={() => setError(null)}
                >
                    OK
                </button>
            </div>

            <div className="avatar">
                <div className="w-8 h-8 bg-gray-300 rounded-full border-1 border-theme-primary mt-1">
                    {comment.profile_image && <img
                        src={comment.profile_image || PLACEHOLDER_PFP}
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
                    <button className="comment-button flex items-center" onClick={handleLike}>
                        <IonIcon icon={liked ? heart : heartOutline}
                            role="img" className={clsx(
                                "md hydrated",
                                liked ? "text-red-600" : "text-black"
                            )} aria-label="heart outline" />
                        <span>Like ({likesCount})</span>
                    </button>
                    {/* <a href="#" className="comment-button">
                        <IonIcon icon={chatbubbleOutline} role="img" className="md hydrated" aria-label="heart outline" />
                        Reply
                    </a> */}
                </div>
            </div>
        </div>
    );
};

const CommentLoadingSkeleton = () => {
    return (
        <div className="flex items-center space-x-2 my-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-1">
                <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
};