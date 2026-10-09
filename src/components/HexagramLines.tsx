import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { isChangingLine, isYangLine, type LineValue } from "@/lib/iching";
import { VIDEOS } from "@/data/videos";

interface Props {
  lines: number[];
  hexagramNumber: number;
  darkMode: boolean;
}

export default function HexagramLines({ lines, hexagramNumber, darkMode }: Props) {
  const renderLine = (value: number, index: number) => {
    const changing = isChangingLine(value);
    const yang = isYangLine(value);
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.15 }}
        className="flex items-center justify-center gap-4"
      >
        <div className="w-48">
          {yang ? (
            <div className="relative">
              <div className={`h-4 rounded ${darkMode ? "bg-gray-400" : "bg-gray-800"}`} />
              {changing && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full bg-gray-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="relative flex gap-6">
              <div className={`h-4 rounded flex-1 ${darkMode ? "bg-gray-400" : "bg-gray-800"}`} />
              <div className={`h-4 rounded flex-1 ${darkMode ? "bg-gray-400" : "bg-gray-800"}`} />
              {changing && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full bg-gray-500" />
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center py-12">
      <div
        className={`rounded-2xl p-8 md:p-12 w-full max-w-2xl ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="text-center mb-4">
          <div className={`text-4xl ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {hexagramNumber}
          </div>
        </div>
        <div className="flex flex-col items-center">
          {VIDEOS[hexagramNumber] && (
            <div className="mb-8">
              <a
                href={VIDEOS[hexagramNumber]}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                Watch Video
              </a>
            </div>
          )}
          <div className="space-y-2 w-full">
            {[...lines].reverse().map((value, i) => renderLine(value, 5 - i))}
          </div>
        </div>
      </div>
    </div>
  );
}
