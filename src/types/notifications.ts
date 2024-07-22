import { Garage } from "./garage";

export interface Notification {
    _id: string;
    date: string;
    is_read: string;
    type: NotificationType;
    entity: Entity;
}

interface NotificationData {
    recent: Notification[];
    last_week: Notification[];
    last_30_days: Notification[];
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'tag' | 'event' | 'club_event' | 'car' | 'post';

export interface NotificationResponse {
    data: NotificationData;
    success: boolean;
}

interface Entity {
    user_id: string;
    entity_id: string;
    entity_type: string;
    entity_data: EntityData | null;
    initiator_data: InitiatorData;
}

interface EntityData {
    media: string;
    post_id?: string;
    comment_id?: string;
    comment?: string;
    garage?: Garage;
}

interface InitiatorData {
    id: number;
    display_name: string;
    profile_image: string | null;
}

