import clsx from 'clsx';
import React from 'react'

interface ThemeBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export const ThemeBtn: React.FC<ThemeBtnProps> = (props) => {
    const { onClick, className, children, loading } = props;

    return (
        <button
            {...props}
            className={clsx(
                "bg-theme-dark disabled:opacity-50 disabled:cursor-not-allowed",
                "px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200",
                className
            )}
            onClick={onClick}>
            {loading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : null}
            {children}
        </button>
    );
}