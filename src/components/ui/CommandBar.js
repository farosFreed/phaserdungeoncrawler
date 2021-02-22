import React from 'react';

const CommandBar = ({ children }) => {
    return (
        <div className={`commandBar`}
        >
            {children}
        </div>
    );
};

export default CommandBar;