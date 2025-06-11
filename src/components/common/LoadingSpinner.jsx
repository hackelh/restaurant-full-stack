import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'text-4xl', color = 'text-blue-500' }) => (
  <div className="flex justify-center items-center p-8">
    <FaSpinner className={`animate-spin ${size} ${color}`} />
    <span className="sr-only">Chargement...</span>
  </div>
);

export default LoadingSpinner;
