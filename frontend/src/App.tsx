import { FC } from 'react';
import AppRoutes from './routes/AppRoutes';

const App: FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <AppRoutes />
    </div>
  );
};

export default App;
