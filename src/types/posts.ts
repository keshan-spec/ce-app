import { Garage } from "./garage";

export type Post = {
    id: number;
    user_id: string;
    username: string;
    caption: string;
    post_date: string;
    location: string;
    likes_count: number;
    comments_count: number;
    media: PostMedia[];
    is_liked: boolean;
    user_profile_image?: string;
    is_bookmarked: boolean;
    garage_id: number | null;
    updated_at: string;
    garage: Garage | null;
    has_tags: boolean;
};

export interface PostMedia {
    id: number;
    post_id: number;
    media_type: string;
    media_url: string;
    media_alt: string;
    media_mime_type: string;
    media_width: string;
    media_height: string;
}