
export interface ScanResponse {
    available: boolean;
    message: string;
    data?: {
        linked_to: string;
        link_type: string;
    };
    qr_code: string;
    status: 'success' | 'error';
}

export interface LinkProfileResponse {
    status: 'success' | 'error';
    message?: string;
    data?: {
        linked_to: string;
        link_type: string;
    };
}