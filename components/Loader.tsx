'use client';
import React, { useEffect, useRef } from 'react';

export const Loader: React.FC = () => {
    const loader = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!loader.current) return;

        const loaderElement = loader.current;
        document.addEventListener('DOMContentLoaded', () => {
            loaderElement.style.display = 'none';
        });
    }, []);

    return (
        <div id="loader" ref={loader}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );
};