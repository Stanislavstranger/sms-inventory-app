import { FC } from 'react';

const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-2xl font-medium mb-4">Страница не найдена</p>
      <p className="text-lg text-gray-600">
        Извините, но запрашиваемая вами страница не существует.
      </p>
      <a href="/" className="mt-6 text-blue-500 hover:underline">
        Вернуться на главную
      </a>
    </div>
  );
};

export default NotFound;
