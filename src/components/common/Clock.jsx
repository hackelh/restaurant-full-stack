import React, { useState, useEffect } from 'react';
import { FaRegClock } from 'react-icons/fa';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <FaRegClock className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {formatTime(time)}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {formatDate(time)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
