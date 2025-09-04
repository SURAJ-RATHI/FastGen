import { useState, useRef, useEffect } from "react";

import QuizCard from "./QuizCard";
import axios from "axios";


const Quizzes = () => {
const [uploadedParsedFileName, setUploadedParsedFileName] = useState("");
const [isUploading ,setIsUploading] = useState(false);
const [uploadProgress ,setUploadProgress] = useState(0);
const [isGenerating, setIsGenerating] = useState(false);
const [quizzes, setQuizzes] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
const fileInputRef = useRef(null);


useEffect(() => {
  const stored = localStorage.getItem('quizzes');
  const storedFileName = localStorage.getItem('uploadedParsedFileName');
  const storedQuestionCount = localStorage.getItem('questionCount');
  if (stored) {
    setQuizzes(JSON.parse(stored));
  }
  if (storedFileName) {
    setUploadedParsedFileName(storedFileName);
  }
  if (storedQuestionCount) {
    setQuestionCount(Number(storedQuestionCount));
  }
}, []);

// Save question count to localStorage whenever it changes
useEffect(() => {
  localStorage.setItem('questionCount', questionCount.toString());
}, [questionCount]);

const handleReset = () => {
  setUploadedParsedFileName("");
  setQuizzes([]);
  localStorage.removeItem('quizzes');
  localStorage.removeItem('uploadedParsedFileName');
};


const handleSend = async () => {
  if (!uploadedParsedFileName) return;

  try {
    setIsGenerating(true);
    // Ensure questionCount is a valid number
    const validQuestionCount = questionCount === '' || isNaN(Number(questionCount)) ? 5 : Number(questionCount);
    console.log('Sending questionCount:', validQuestionCount); // Debug log
    const res = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/GQuizzes`, {
      parsedFileName: uploadedParsedFileName,
      questionCount: validQuestionCount,
    }, {
      withCredentials: true,
    });

    console.log('Gemini response:', res.data);

  
    const parsed = JSON.parse(res.data.answer);
    setQuizzes(parsed);
    localStorage.setItem('quizzes', JSON.stringify(parsed));
  } catch (err) {
    console.error("Failed to generate quizzes:", err);
  } finally {
    setIsGenerating(false);
  }
};

const handleFileChange = async (e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  const formData = new FormData();
  formData.append('file', selected);
  formData.append('fileName', selected.name);

  setIsUploading(true);
  setUploadProgress(0);

  try {
    const res = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    });

    setIsUploading(false);
    console.log('File uploaded:', res.data);
    setUploadedParsedFileName(res.data.parsedFileName);
    localStorage.setItem('uploadedParsedFileName', res.data.parsedFileName);

  } catch (err) {
    console.error("Upload failed:", err);
    setIsUploading(false);
  }
};

const handleAttachClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};



return (
  <div className="h-[91vh] bg-black overflow-hidden">
    <div className="h-full overflow-y-auto scrollbar-hide p-4">
    
    {/* HEADER SECTION - File name, question count controls, and reset button */}
    {uploadedParsedFileName && (
      <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
        {/* File info and reset button row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">File Uploaded</p>
              <p className="text-gray-300 text-sm">{uploadedParsedFileName}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Reset
          </button>
        </div>
        
        {/* Question count controls row */}
        <div className="flex items-center gap-4">
          <label className="text-white text-sm font-medium">Number of Questions:</label>
          
          <input
            type="number"
            value={questionCount}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string for typing
              if (value === '') {
                setQuestionCount('');
                return;
              }
              // Convert to number and validate
              const numValue = Number(value);
              if (!isNaN(numValue) && numValue >= 1 && numValue <= 50) {
                setQuestionCount(numValue);
              }
            }}
            onBlur={(e) => {
              // Ensure valid value on blur
              const value = Number(e.target.value);
              if (isNaN(value) || value < 1 || value > 50) {
                setQuestionCount(5); // Reset to default if invalid
              }
            }}
            placeholder="Enter number (1-50)"
            min="1"
            max="50"
            step="1"
            className="px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 w-32"
          />
          
          <span className="text-gray-300 text-sm">
            Selected: {questionCount} questions
          </span>
        </div>
      </div>
    )}
    
    {/* UPLOAD AREA */}
    {quizzes.length === 0 && !isGenerating && (
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.txt"
        />

        {!isUploading && !uploadedParsedFileName ? (
          // SHOW upload field BEFORE file upload
          <div className="space-y-3">
            <div
              onClick={handleAttachClick}
              className="w-100% h-20 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors bg-gray-800"
            >
              <span className="text-sm text-gray-300">📄 Upload PDF or TXT File</span>
            </div>
            <p className="text-xs text-gray-500 text-center">PDF and TXT files are supported for text extraction</p>
          </div>
        ) : isUploading ? (
          // SHOW progress bar DURING upload
          <div className="w-40 h-4 bg-gray-700 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        ) : (
          // AFTER file uploaded
          <p className="text-green-400 font-medium">✅ File uploaded!</p>
        )}

        {/* GENERATE button appears ONLY if file is uploaded */}
        {uploadedParsedFileName && (
          <button
            onClick={handleSend}
            disabled={isUploading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Generate Quizzes
          </button>
        )}
      </div>
    )}

    {/* LOADING INDICATOR */}
    {isGenerating && <p className="text-white">Loading quizzes...</p>}

    {/* QUIZZES */}
    {quizzes.length > 0 && (
      <div className="space-y-8 mt-6">
        {quizzes.map((q, i) => (
          <QuizCard key={i} index={i} q={q} />
        ))}

      </div>
    )}
    </div>
  </div>
);
}
 
export default Quizzes;