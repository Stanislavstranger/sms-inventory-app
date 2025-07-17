import { ChangeEvent, FC, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/products';
import { Product } from '@shared/interfaces/product.interface';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Button, ConfirmationModal, Input } from '..';

interface ProductTableProps {
  /* eslint-disable-next-line */
  onEdit: (product: Product) => void;
  refreshTrigger: number;
}

const ProductTable: FC<ProductTableProps> = ({ onEdit, refreshTrigger }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [inputSearchValue, setInputSearchValue] = useState(searchParams.get('search') || '');
  const { addToast } = useToast();

  const debouncedInputSearchValue = useDebounce(inputSearchValue, 500);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const searchTermFromUrl = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProducts(page, limit, searchTermFromUrl);
      setProducts(response.data);
      setTotal(response.total);
    } catch {
      addToast('Ошибка при загрузке товаров', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTermFromUrl, addToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshTrigger, searchParams]);

  useEffect(() => {
    if (debouncedInputSearchValue !== searchTermFromUrl) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (debouncedInputSearchValue) {
          newParams.set('search', debouncedInputSearchValue);
        } else {
          newParams.delete('search');
        }
        newParams.set('page', '1');
        return newParams;
      });
    }
  }, [debouncedInputSearchValue, setSearchParams, searchTermFromUrl]);

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputSearchValue(e.target.value);
  };

  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('limit', e.target.value);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete !== null) {
      setIsLoading(true);
      try {
        await deleteProduct(productToDelete);
        addToast('Товар успешно удален', 'success');
        fetchProducts();
      } catch {
        addToast('Ошибка при удалении товара', 'error');
      } finally {
        setIsModalOpen(false);
        setProductToDelete(null);
        setIsLoading(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="relative rounded-lg shadow-md">
      <div className="p-4 bg-white rounded-t-lg">
        <Input
          type="text"
          placeholder="Поиск по названию или артикулу..."
          value={inputSearchValue}
          onChange={handleSearchInputChange}
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">ID</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Название</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Артикул</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Цена</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Количество</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{product.id}</td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.article}</td>
                  <td className="py-3 px-4">{product.price}</td>
                  <td className="py-3 px-4">{product.quantity}</td>
                  <td className="py-3 px-4">
                    <Button
                      onClick={() => onEdit(product)}
                      variant="primary"
                      size="sm"
                      title="Редактировать"
                      iconName="edit"
                      children={undefined}
                    ></Button>
                    <Button
                      onClick={() => handleDeleteClick(product.id)}
                      variant="danger"
                      size="sm"
                      title="Удалить"
                      className="ml-2"
                      iconName="delete"
                      children={undefined}
                    ></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  {searchTermFromUrl
                    ? `Товары по запросу "${searchTermFromUrl}" не найдены`
                    : 'Товары не найдены'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {products.length > 0 && (
          <div className="flex justify-between items-center mt-4 p-4 bg-white rounded-b-lg">
            <div className="flex items-center">
              <label htmlFor="limit-select" className="mr-2 text-gray-700">
                Показывать по:
              </label>
              <select
                id="limit-select"
                value={limit}
                onChange={handleLimitChange}
                className="border rounded py-1 px-2 text-gray-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              variant="secondary"
            >
              Назад
            </Button>
            <span className="text-gray-700 mx-2">
              Страница {page} из {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              variant="secondary"
            >
              Вперед
            </Button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Подтвердите удаление"
        message="Вы уверены, что хотите удалить этот товар?"
      />
    </div>
  );
};

export default ProductTable;
