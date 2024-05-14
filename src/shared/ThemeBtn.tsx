import clsx from 'clsx';
import React from 'react';

interface ThemeBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    icon?: string;
}

export const ThemeBtn: React.FC<ThemeBtnProps> = (props) => {
    const { onClick, className, children, loading, icon } = props;

    return (
        <button
            {...props}
            className={clsx(
                "uppercase bg-theme-primary w-full hover:bg-theme-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
                loading && "cursor-not-allowed bg-theme-primary-light",
                className
            )}
            onClick={onClick}>
            {loading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : icon ? (
                <i className={`${icon} mr-2`}></i>
            ) : null}
            {children}
        </button>
    );
};