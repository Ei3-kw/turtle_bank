// src/components/UI/Button.js
import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        primary: 'bg-primary-main text-background-paper hover:bg-primary-dark focus:ring-primary-light',
        secondary: 'bg-secondary-main text-background-paper hover:bg-secondary-dark focus:ring-secondary-light',
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;