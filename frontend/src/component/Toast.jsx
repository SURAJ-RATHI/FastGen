import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'error', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-400" />;
      case 'info':
        return <FiInfo className="w-5 h-5 text-blue-400" />;
      case 'error':
      default:
        return <FiAlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-700';
      case 'info':
        return 'bg-blue-900 border-blue-700';
      case 'error':
      default:
        return 'bg-red-900 border-red-700';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${getBgColor()}`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-white text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
