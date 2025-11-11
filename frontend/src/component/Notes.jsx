import { useEffect, useState } from "react";
import { RxNotionLogo } from "react-icons/rx";

const Notes = () => {
  const [userText, setUserText] = useState('');

  // Retrieve notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setUserText(savedNotes);
    }
  }, []); // Empty dependency array to run only on mount

  // Save notes to localStorage 
  useEffect(() => {
    localStorage.setItem('notes', userText);
  }, [userText]); 

  const handleNotionToggle = () => {
    window.open("https://www.notion.com/");
  };

  return (
    <div className="relative w-full h-[91vh] bg-white overflow-hidden">
      <div className="h-full p-4">
      {/* Notion button */}
      <button
        onClick={handleNotionToggle}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-md shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <RxNotionLogo className="text-lg" />
        <span>Notion</span>
      </button>

      {/* Textarea fills the whole space */}
      <textarea
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        placeholder="Write anything..."
        className="w-full h-full p-8 text-base outline-none border-none resize-none overflow-y-scroll scrollbar-hide bg-white text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 placeholder-gray-400"
      ></textarea>
      </div>
    </div>
  );
};

export default Notes;