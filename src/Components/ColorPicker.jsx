import React, {useState} from "react";
import {Check} from "lucide-react"; // dùng icon tick

// const COLORS = [
//     "#4CAF50",
//     "#F44336",
//     "#FFEB3B",
//     "#FF9800",
//     "#03A9F4",
//     "#1E40AF",
//     "#8B5CF6",
//     "#EC4899",
//     "#F9FAFB",
//     "#000000",
// ];

const ColorPicker = ({
    colors = [],
    selectedColors = [],
    onColorSelect,
    classColorPicker = "",
}) => {
    const handleColorSelect = (color) => {
        const colorLower = color.toLowerCase();
        const isSelected = selectedColors.includes(colorLower);

        if (isSelected) {
            onColorSelect(selectedColors.filter((c) => c !== colorLower));
        } else {
            onColorSelect([...selectedColors, colorLower]);
        }
    };

    // Convert color names to hex values for display
    const getColorValue = (color) => {
        const colorMap = {
            red: "#EF4444",
            blue: "#3B82F6",
            green: "#10B981",
            black: "#000000",
            white: "#FFFFFF",
            yellow: "#F59E0B",
            purple: "#8B5CF6",
            pink: "#EC4899",
            gray: "#6B7280",
            orange: "#F97316",
        };

        return colorMap[color.toLowerCase()] || color;
    };

    return (
        <div className={`color-picker ${classColorPicker}`}>
            <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => {
                    const colorValue = getColorValue(color);
                    const isSelected = selectedColors.includes(
                        color.toLowerCase()
                    );

                    return (
                        <button
                            key={`color-${index}`}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 relative ${
                                isSelected
                                    ? "border-gray-800 scale-110"
                                    : "border-gray-300 hover:border-gray-500"
                            } ${
                                color.toLowerCase() === "white"
                                    ? "border-gray-400"
                                    : ""
                            }`}
                            style={{backgroundColor: colorValue}}
                            onClick={() => handleColorSelect(color)}
                            title={color}
                            aria-label={`Select ${color} color`}
                        >
                            {isSelected && (
                                <Check
                                    className="absolute inset-0 m-auto w-4 h-4"
                                    style={{
                                        color:
                                            color.toLowerCase() === "white"
                                                ? "#000"
                                                : "#fff",
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorPicker;
