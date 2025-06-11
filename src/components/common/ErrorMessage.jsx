import { FaExclamationCircle } from 'react-icons/fa';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <FaExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
