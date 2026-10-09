import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  question: string;
  setQuestion: (q: string) => void;
  darkMode: boolean;
}

export default function QuestionInput({ question, setQuestion, darkMode }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mb-12"
    >
      <div
        className={`border rounded-2xl p-8 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}
      >
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Describe your current state, or question you have (optional)"
          className={`min-h-[120px] text-base ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500"
              : "bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
          }`}
        />
      </div>
    </motion.div>
  );
}
