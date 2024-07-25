export interface CommentsResponse {

}

export interface TComment {
    id: string;
    post_id: string;
    parent_comment_id: string | null;
    user_id: string;
    user_login: string;
    user_email: string;
    user_registered: string;
    display_name: string;
    profile_image: string | null;
    comment: string;
    comment_date: string;
    updated_at: string | null;
    liked: boolean;
    likes_count: number;
    replies: TComment[];
}


