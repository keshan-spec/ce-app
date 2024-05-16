import Link from 'next/link';
import React from 'react';

interface SocialButtonProps {
    children: React.ReactNode;
    icon?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ children, icon }) => {
    return (
        <Link href="#"
            className="overflow-hidden relative uppercase w-full hover:bg-theme-secondary flex items-center justify-center text-white font-bold h-9 rounded focus:outline-none focus:shadow-outline bg-theme-dark">
            {icon && <i className={`${icon} mr-2 bg-theme-dark-100 px-3 w-fit max-w-10 text-center h-full flex items-center absolute left-0 rounded-sm`}></i>}
            {children}
        </Link>
    );
};