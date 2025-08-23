import { useState } from "react";
function QuizCard({ index, q }) {
  const [selected, setSelected] = useState('');
  const isCorrect = selected === q.answer;

return (
  <div className="p-6 border border-gray-600 rounded-xl bg-[#070925] shadow-lg  transition-colors">
    <h2 className="font-semibold text-lg mb-4 border-b  border-gray-700 pb-2 text-white">
      Q{index + 1}. {q.question}
    </h2>
    <div className="space-y-3">
      {q.options.map((option, i) => (
        <label
          key={i}
          className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-[0_0_10px_rgba(90,175,255,0.4)] hover:border-blue-400"
        >
          <input
            type="radio"
            name={`q-${index}`}
            value={option}
            onChange={() => setSelected(option)}
            disabled={!!selected}
            className="accent-blue-500 hidden"
          />
          <span className="text-gray-100">{option}</span>
        </label>
      ))}
    </div>
    {selected && (
      <p className={`mt-4 font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
        {isCorrect ? '✅ Correct!' : `❌ Incorrect. Correct Answer: ${q.answer}`}
      </p>
    )}
  </div>
);
}

export default QuizCard
