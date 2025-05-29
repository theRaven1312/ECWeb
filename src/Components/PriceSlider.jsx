import React, { useState } from "react";

const PriceSlider = ({ value, onChange, min = 0, max = 1000 }) => {
  const handleChange = (e, index) => {
    const newValue = [...value];
    newValue[index] = parseInt(e.target.value);

    // Ensure min is always less than max
    if (index === 0 && newValue[0] >= newValue[1]) {
      newValue[0] = newValue[1] - 1;
    }
    if (index === 1 && newValue[1] <= newValue[0]) {
      newValue[1] = newValue[0] + 1;
    }

    onChange(newValue);
  };

  return (
    <div className="price-slider">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Min</label>
            <input
              type="range"
              min={min}
              max={max}
              value={value[0]}
              onChange={(e) => handleChange(e, 0)}
              className="price-range-input"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Max</label>
            <input
              type="range"
              min={min}
              max={max}
              value={value[1]}
              onChange={(e) => handleChange(e, 1)}
              className="price-range-input"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="number"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => handleChange(e, 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <input
            type="number"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => handleChange(e, 1)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
