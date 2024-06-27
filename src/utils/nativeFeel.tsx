"use client";

declare global {
    interface Window {
        ReactNativeWebView: {
            postMessage: (message: string) => void;
        };
    }
}

export const PLACEHOLDER_PFP = "/assets/img/profile-placeholder.jpg";

export const vibrateDevice = (pattern: number | number[]) => {
    if (typeof window !== "undefined" && "vibrate" in window.navigator) {
        window.navigator.vibrate(pattern);
    }
};

interface PostMessage {
    type: 'createPost' | 'addEventPost' | 'authData';
    user_id: string | number;
    page?: string;
}

export const sendRNMessage = ({
    page,
    type,
    user_id
}: PostMessage) => {
    if (typeof window.ReactNativeWebView === 'undefined') {
        console.warn(`This is not a react native webview, failed to send message: ${type} - ${user_id}`);
    }

    try {
        if (window !== undefined && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type,
                page,
                user_id,
            }));
        }
    } catch (e) {
        console.error(e);
    }
};