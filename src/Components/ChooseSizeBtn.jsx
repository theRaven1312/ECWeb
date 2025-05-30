import React from 'react';

const ChooseSizeBtn = ({ size, isSelected, onSelect }) => {
    return (
        <button
            className={`size-btn ${isSelected ? 'size-btn--selected' : ''}`}
            onClick={onSelect}
        >
            {size}
        </button>
    );
};

export default ChooseSizeBtn;
