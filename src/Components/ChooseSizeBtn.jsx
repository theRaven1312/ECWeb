import React from 'react';

const ChooseSizeBtn = ({ size, isSelected, onSelect }) => {
    return (
        <button
            className={`border-1 border-gray-400 text-black py-2 px-6 rounded-3xl ${isSelected ? 'bg-black text-white' : ''}`}
            onClick={onSelect}
        >
            {size}
        </button>
    );
};

export default ChooseSizeBtn;
