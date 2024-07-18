export type Garage = {
    id: number;
    owner_id: string;
    cover_photo: string;
    make: string;
    model: string;
    variant?: string;
    short_description: string;
    primary_car: boolean;
    registration: string;
    owned_since: string;
    owned_until: string;
    images: GarageImage[];
    colour: string | null;
    allow_tagging: string;
    created_at: string;
    updated_at: string;
    status: 'active' | 'deleted';
    owner: {
        name: string;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        profile_image: string;
    } | null;
};

export interface GarageImage {
    id: number;
    garage_id: number;
    image_url: string;
    image_alt: string;
    image_mime_type: string;
    image_width: string;
    image_height: string;
}