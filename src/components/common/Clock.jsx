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

  return (
    <div className="flex items-center gap-2 text-xl font-semibold text-blue-700">
      <FaRegClock className="w-6 h-6" />
      <span>{formatTime(time)}</span>
    </div>
  );
};

export default Clock;
