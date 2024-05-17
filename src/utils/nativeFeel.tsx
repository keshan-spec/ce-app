import { useEffect } from "react";

export const vibrateDevice = (pattern: number | number[]) => {
    if (typeof window !== "undefined" && "vibrate" in window.navigator) {
        window.navigator.vibrate(pattern);
    }
};