import { FC, useEffect, useState } from 'react';

interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const Toast: FC<ToastProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`p-4 rounded-lg shadow-lg mb-2 ${bgColor} text-white transition-opacity duration-500 ease-out`}
    >
      {message}
    </div>
  );
};

export default Toast;
