"use server";

import { LinkProfileResponse, ScanResponse } from "@/types/qr-code";
import { getSessionUser } from "./auth-actions";
import { API_URL } from "./api";

export const verifyScan = async (decodedText: string): Promise<ScanResponse | null> => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user", e);
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/verify-qr-code`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, qr_code: decodedText }),
    });

    const data = await response.json();
    return data;
};

export const linkProfile = async (decodedText: string): Promise<any | null> => {
    let user;

    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user", e);
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/link-qr-code-entity`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ entity_id: user?.id, qr_code: decodedText, entity_type: "profile" }),
    });

    const data = await response.json();
    return data;
};

export const getIDFromQrCode = async (decodedText: string): Promise<LinkProfileResponse | null> => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-linked-entity`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ qr_code: decodedText }),
    });

    const data = await response.json();

    if ((data && data.error) || response.status === 404) {
        throw new Error(data.error);
    }

    return data;
};