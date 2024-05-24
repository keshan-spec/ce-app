import Link from 'next/link';
import React from 'react';

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: string;
    link?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ children, icon, link, ...props }) => {
    const { className, onClick } = props;

    const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('handleLinkClick', link);
        if (link) {
            window.open(link, "_blank");
        } else {
            onClick && onClick(e);
        }
    };

    return (
        <button
            {...props}
            onClick={handleLinkClick}
            className={`overflow-hidden relative uppercase w-full hover:bg-theme-secondary flex items-center justify-center text-white font-bold h-9 rounded focus:outline-none focus:shadow-outline bg-theme-dark ${className}`}
        >
            {icon && <i className={`${icon} mr-2 bg-theme-dark-100 px-3 w-fit max-w-10 text-center h-full flex items-center absolute left-0 rounded-sm`}></i>}
            {children}
        </button>
    );
};