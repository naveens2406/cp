import React from 'react';

/**
 * MagneticBtn — Premium button with subtle hover effects.
 * Removes magnetic effect, adds clean translateY + glow on hover.
 */
const MagneticBtn = ({ children, as: Tag = 'button', className = '', onClick, ...rest }) => {
    return (
        <Tag
            className={`btn-primary ${className}`}
            onClick={onClick}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default MagneticBtn;
