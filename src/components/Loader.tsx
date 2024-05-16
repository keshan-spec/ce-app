'use client';
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';

interface LoaderProps {
    transulcent?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
    transulcent = false
}) => {
    const loader = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loader.current) return;

        const loaderElement = loader.current;
        document.addEventListener('DOMContentLoaded', () => {
            loaderElement.style.display = 'none';
        });
    }, []);

    return (
        <div id="loader" ref={loader} className={
            clsx(
                transulcent && "!bg-white/80"
            )
        }>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );
};