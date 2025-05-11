import React, { useState } from "react";
import { Range } from "react-range";

const PriceSlider = () => {
  const STEP = 1;
  const MIN = 0;
  const MAX = 300;

  const [values, setValues] = useState([50, 200]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Range
        step={STEP}
        min={MIN}
        max={MAX}
        values={values}
        onChange={(values) => setValues(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 bg-gray-200 rounded-full"
            style={{ ...props.style }}>
            <div
              className="h-2 bg-black rounded-full"
              style={{
                position: "absolute",
                left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%`,
              }}/>
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-4 h-4 bg-black rounded-full shadow"
          />
        )}
      />
      <div className="flex justify-between mt-4">
        <span>${values[0]}</span>
        <span>${values[1]}</span>
      </div>
    </div>
  );
};

export default PriceSlider;
