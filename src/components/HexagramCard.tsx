import React from "react";
import { getHexagramByNumber } from "@/data/hexagrams";

interface HexagramCardProps {
  hexagramNumber: number;
  isTransformed?: boolean;
  darkMode?: boolean;
}

export default function HexagramCard({
  hexagramNumber,
  isTransformed = false,
  darkMode = false,
}: HexagramCardProps) {
  const hexagram = getHexagramByNumber(hexagramNumber);

  if (!hexagram) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 border shadow-sm transition-colors ${
        darkMode
          ? "bg-gray-800/80 border-gray-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <div className="border-b pb-4 mb-6 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
              darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Hexagram {hexagramNumber}
          </span>
          {isTransformed && (
            <span className="text-xs text-amber-500 font-medium">
              Transformed Result
            </span>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-2">
          {hexagram.name}
        </h2>
        <p
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {hexagram.subtitle}
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        {hexagram.description && (
          <div>
            <h4
              className={`text-xs uppercase font-semibold tracking-wider mb-1.5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Meaning & Nature
            </h4>
            <p
              className={`font-serif text-base leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {hexagram.description}
            </p>
          </div>
        )}

        {hexagram.judgment && (
          <div>
            <h4
              className={`text-xs uppercase font-semibold tracking-wider mb-1.5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              The Judgment
            </h4>
            <p
              className={`font-serif italic text-base leading-relaxed ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              "{hexagram.judgment}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
