export interface Notification {
    _id: string;
    date: string;
    is_read: string;
    type: NotificationType;
    entity: Entity;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'tag' | 'event' | 'club_event' | 'car';

export interface NotificationResponse {
    data: Notification[];
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
}

interface InitiatorData {
    id: number;
    display_name: string;
    profile_image: string | null;
}

