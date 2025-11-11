import { useState } from "react";
function QuizCard({ index, q }) {
  const [selected, setSelected] = useState('');
  const isCorrect = selected === q.answer;

return (
  <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm transition-colors">
    <h2 className="font-medium text-lg mb-4 border-b border-gray-200 pb-2 text-gray-900">
      Q{index + 1}. {q.question}
    </h2>
    <div className="space-y-3">
      {q.options.map((option, i) => (
        <label
          key={i}
          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
        >
          <input
            type="radio"
            name={`q-${index}`}
            value={option}
            onChange={() => setSelected(option)}
            disabled={!!selected}
            className="accent-gray-900 hidden"
          />
          <span className="text-gray-900">{option}</span>
        </label>
      ))}
    </div>
    {selected && (
      <p className={`mt-4 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
        {isCorrect ? '✅ Correct!' : `❌ Incorrect. Correct Answer: ${q.answer}`}
      </p>
    )}
  </div>
);
}

export default QuizCard
