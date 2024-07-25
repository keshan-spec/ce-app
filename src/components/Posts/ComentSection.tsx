'use client';
import { addComment, fetchPostComments, fetchTaggableEntites, maybeLikeComment } from "@/actions/post-actions";
import { useUser } from "@/hooks/useUser";
import { formatPostDate } from "@/utils/dateUtils";
import { useQuery } from "@tanstack/react-query";
import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import { chatbubbleOutline, chevronUpCircleOutline, close, heart, heartOutline } from "ionicons/icons";
import { useCallback, useMemo, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import { debounce } from "@/utils/utils";
import { TComment } from "@/types/comments";
// import { useQuery } from "react-query";

interface ComentsSectionProps {
    postId: number;
    onNewComment?: () => void;
}

export const ComentsSection: React.FC<ComentsSectionProps> = ({
    postId,
    onNewComment,
}) => {
    const { data, error, isFetching, isLoading, refetch } = useQuery<TComment[], Error>({
        queryKey: ["post-comments", postId],
        queryFn: () => {
            return fetchPostComments(postId);
        },
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        // keepPreviousData: true,
    });

    const [replyingTo, setReplyingTo] = useState<TComment | null>(null);

    console.log(data);

    const onCommentAdded = () => {
        refetch();
        onNewComment && onNewComment();
    };

    const minHeight = useMemo(() => {
        if (data && data.length > 0) {
            return `min-h-[${data.length * 50}vh]`;
        }

        return "min-h-[90vh]";
    }, [data]);

    const onReply = (comment: TComment) => {
        setReplyingTo(comment);
    };

    return (
        <div className={clsx("w-full overflow-scroll h-full px-4", minHeight)}>
            <div className="section full mb-3 w-full">
                {(isLoading || isFetching) && <CommentLoadingSkeleton />}

                {error && <p className="px-3">{error.message}</p>}

                {(data && data.length === 0 && !(isLoading || isFetching)) && (
                    <p className="px-3">No comments found</p>
                )}

                {data && data.length > 0 && (
                    <div className="comment-block mt-1">
                        {data.map((comment) => (
                            <Comment key={comment.id} comment={comment} onReply={onReply} />
                        ))}
                    </div>
                )}
            </div>
            <CommentForm
                postId={postId}
                onCommentAdded={onCommentAdded}
                isReplyingTo={replyingTo}
                onReplyCancel={() => { setReplyingTo(null); }}
            />
        </div>
    );
};

const Comment: React.FC<{ comment: TComment; onReply: (comment: TComment) => void; }> = ({ comment, onReply }) => {
    const [likesCount, setLikesCount] = useState<number>(comment.likes_count ?? 0);
    const [liked, setLiked] = useState(comment.liked);
    const [error, setError] = useState<string | null>(null);
    const [showReplies, setShowReplies] = useState(false);

    const handleLike = async () => {
        const newLikedState = !liked;
        const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;

        // Optimistically update the UI
        setLiked(newLikedState);
        setLikesCount(newLikesCount);

        try {
            const responsne = await maybeLikeComment(comment.id, comment.user_id);
            if (responsne) {
                comment.liked = newLikedState;
                comment.likes_count = newLikesCount;
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
        <div className="item !mb-3 overflow-hidden">
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
                <div className="w-8 h-8 bg-gray-300 rounded-full border-1 border-theme-primary">
                    {comment.profile_image && <img
                        src={comment.profile_image || PLACEHOLDER_PFP}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
                    />}
                </div>
            </div>
            <div className="in">
                <div className="comment-header">
                    <h4 className="text-sm p-0 m-0 font-semibold">
                        {comment.user_login}
                    </h4>
                    <div className="flex flex-col justify-end items-end">
                        <span className="time">{formatPostDate(comment.comment_date)}</span>
                    </div>
                </div>
                <div className="text">
                    {comment.comment}
                </div>
                <div className="comment-footer">
                    <button className="comment-button flex items-center" onClick={handleLike}>
                        <IonIcon icon={liked ? heart : heartOutline}
                            role="img" className={clsx(
                                "md hydrated !mr-1",
                                liked ? "text-red-600" : "text-black"
                            )} aria-label="heart outline" />
                        {likesCount > 0 && <span className="likes-count">{likesCount}</span>}
                    </button>

                    {comment.parent_comment_id === null && (
                        <button className="comment-button" onClick={() => onReply(comment)}>
                            <IonIcon icon={chatbubbleOutline} role="img" className="md hydrated" aria-label="chatbubble outline" />
                            Reply
                        </button>
                    )}
                </div>
                {comment.replies.length > 0 && (
                    <button
                        className="my-2"
                        onClick={() => setShowReplies(!showReplies)}
                    >
                        {showReplies ? "Hide" : "Show"} {comment.replies.length} replies
                    </button>
                )}
                {showReplies && comment.replies.length > 0 && (
                    <div className="replies">
                        {comment.replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                onReply={() => {
                                    onReply(reply);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CommentForm: React.FC<{
    postId: number;
    onCommentAdded: () => void;
    isReplyingTo: TComment | null;
    onReplyCancel: () => void;
}> = ({ postId, onCommentAdded, isReplyingTo, onReplyCancel }) => {
    const { isLoggedIn } = useUser();

    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState(4);
    const [currentTag, setCurrentTag] = useState<string>("");

    const { data, isFetching, isLoading, refetch } = useQuery<any[], Error>({
        queryKey: ["taggable-entities"],
        queryFn: () => fetchTaggableEntites(currentTag, [], false),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: currentTag.trim().length > 3,
    });


    const handleTagInputChange = async (value: string) => {
        if (value.includes("@")) {
            const query = value.split("@").pop();
            if (query && query.trim().length > 4) {
                setCurrentTag(value);

                try {
                    await refetch({
                        cancelRefetch: isFetching || isLoading,
                    });
                } catch (e: any) {
                    console.error('Error fetching taggable entities', e.message);
                }
            }
        } else {
            setCurrentTag("");
        }
    };

    const debouncedHandleTagInputChange = useCallback(debounce(handleTagInputChange, 500), []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading || comment.length === 0) return;
        const trimmedComment = comment.trim();
        setComment("");

        setLoading(true);
        setError(null);

        try {
            // Add comment
            const response = await addComment(postId, trimmedComment, isReplyingTo?.id);
            if (response) {
                if (isReplyingTo) {
                    onReplyCancel();
                }

                onCommentAdded();
            }
        } catch (error: any) {
            setError(error.message);
        }

        setLoading(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="absolute bottom-4 z-10 w-full inset-x-0 px-4">
                <p className="text-sm text-center text-gray-500">
                    Please login to post a comment
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-start space-x-2 py-2 min-h-11 bg-white">
            <div className="comments-container-footer relative">
                <div className="comment-submit-button z-30">
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
                    className="form-control relative !text-sm z-20 !focus-within:ring-transparent !focus:ring-0 !focus:outline-none !ring-0"
                    rows={rows}
                    placeholder="Comment..."
                    spellCheck="false"
                    value={comment}
                    autoFocus
                    // onFocus={() => {
                    //     setRows(4);
                    // }}
                    // onBlur={() => {
                    //     setRows(2);
                    // }}
                    onInput={(e) => debouncedHandleTagInputChange(e.currentTarget.value)}
                    onChange={(e) => setComment(e.target.value)}
                />

                {isReplyingTo && (
                    <div className="absolute -top-9 rounded-t-lg w-full bg-gray-200 px-3 py-2 text-xs z-10">
                        <div className="flex justify-between w-full items-center font-semibold h-6">
                            <span>Replying to {isReplyingTo?.user_login}</span>
                            <button onClick={onReplyCancel}>
                                <IonIcon icon={close} role="img" className="md hydrated text-lg" aria-label="close" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="results absolute w-full z-50 left-0 px-2 bg-white bottom-14">
                    {(isFetching || isLoading) && (
                        <div className="tag-suggestions max-h-36 overflow-scroll shadow-md w-full border">
                            <div className="tag-suggestion p-1 border-b flex items-center gap-2 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-gray-200 "></div>
                                <div className='w-32 h-4 bg-gray-200'></div>
                            </div>
                        </div>
                    )}

                    {/* if no data */}
                    {!isFetching && !isLoading && data && data.length === 0 && (
                        <div className="tag-suggestions max-h-36 overflow-scroll shadow-md w-full border">
                            <div className="tag-suggestion p-1 border-b">No results found</div>
                        </div>
                    )}

                    {(!(isFetching || isLoading) && (data && data.length > 0 && currentTag.length > 3)) && (
                        <div className="tag-suggestions max-h-44 overflow-scroll shadow-md w-full border">
                            {data.map((entity, idx) => (
                                <div key={idx} className="tag-suggestion p-1 border-b flex items-center gap-2" onClick={() => {
                                    console.log(entity);
                                }}>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2">
                                        <img src={entity.image || PLACEHOLDER_PFP} alt={entity.name} className="w-full h-full rounded-full" />
                                    </div>
                                    <div>{entity.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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