export type Post = {
    id: number;
    user_id: string;
    username: string;
    caption: string;
    post_date: string;
    location: string;
    media: PostMedia[];
};

export interface PostMedia {
    id: number;
    post_id: number;
    media_type: string;
    media_url: string;
    media_alt: string;
    media_mime_type: string;
    media_width: number;
    media_height: number;
}