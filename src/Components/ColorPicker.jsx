import { useState } from "react";
import { Check } from "lucide-react"; // dùng icon tick

const COLORS = [
  "#4CAF50", "#F44336", "#FFEB3B", "#FF9800", "#03A9F4",
  "#1E40AF", "#8B5CF6", "#EC4899", "#F9FAFB", "#000000"
];

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <div className=" max-w-xs mx-auto">
      <div className="flex flex-wrap w-full gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(selectedColor === color ? null : color)}
            className={`w-8 h-8 rounded-full flex items-center justify-center 
              border-2 ${selectedColor === color ? "border-gray-400" : "border-transparent"}`}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <Check className="w-5 h-5 text-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
