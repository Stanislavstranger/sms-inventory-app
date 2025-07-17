import { FC, useState } from 'react';
import { createProduct, updateProduct } from '../api/products';
import { Product } from '@shared/interfaces/product.interface';
import { useToast } from '../context/ToastContext';
import { AxiosError } from 'axios';
import Button from '../components/Button';
import { ProductForm, ProductTable } from '../components';

const ProductManagementPage: FC = () => {
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { addToast } = useToast();

  const handleAddProductClick = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const refreshProducts = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        addToast('Товар успешно обновлен', 'success');
      } else {
        await createProduct(productData);
        addToast('Товар успешно создан', 'success');
      }
      setShowForm(false);
      setEditingProduct(undefined);
      refreshProducts();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        addToast('Товар с таким артикулом уже существует.', 'error');
      } else {
        addToast('Ошибка при сохранении товара', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Учет товаров</h1>

      {!showForm && (
        <div className="mb-4">
          <Button onClick={handleAddProductClick} variant="primary">
            Добавить товар
          </Button>
        </div>
      )}

      {showForm ? (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
          isSaving={isSaving}
        />
      ) : (
        <ProductTable onEdit={handleEditProduct} refreshTrigger={refreshTrigger} />
      )}
    </div>
  );
};

export default ProductManagementPage;
