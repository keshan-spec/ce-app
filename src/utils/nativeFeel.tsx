"use client";
export const vibrateDevice = (pattern: number | number[]) => {
    if (typeof window !== "undefined" && "vibrate" in window.navigator) {
        window.navigator.vibrate(pattern);
    }
};

export const PLACEHOLDER_PFP = "/assets/img/profile-placeholder.jpg";