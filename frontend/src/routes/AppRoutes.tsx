import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductManagementPage from '../pages/ProductManagementPage';
import NotFound from '../pages/NotFound';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductManagementPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
