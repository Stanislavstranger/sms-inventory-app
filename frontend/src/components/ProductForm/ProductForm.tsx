import { useState, useEffect, ChangeEvent, FC, FormEvent, useRef } from 'react';
import { z } from 'zod';
import { Product } from '@shared/interfaces/product.interface';
import { Button, Input } from '..';

const productSchema = z.object({
  name: z.string().min(1, 'Название не может быть пустым'),
  article: z.string().min(1, 'Артикул не может быть пустым'),
  price: z.preprocess((val) => Number(val), z.number().positive('Цена должна быть больше 0')),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Количество не может быть отрицательным'),
  ),
});

interface ProductFormProps {
  product?: Product;
  /* eslint-disable-next-line */
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

type ProductFormData = {
  name: string;
  article: string;
  price: string;
  quantity: string;
};

const ProductForm: FC<ProductFormProps> = ({ product, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    article: '',
    price: '',
    quantity: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    article: '',
    price: '',
    quantity: '',
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const articleInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        article: product.article,
        price: String(product.price),
        quantity: String(product.quantity),
      });
    } else {
      setFormData({ name: '', article: '', price: '', quantity: '' });
    }
  }, [product]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      const sanitizedValue = value.replace(',', '.');
      const priceRegex = /^\d*(\.\d{0,2})?$/;
      if (priceRegex.test(sanitizedValue)) {
        setFormData((prev) => ({ ...prev, price: sanitizedValue }));
      }
    } else if (name === 'quantity') {
      const quantityRegex = /^\d*$/;
      if (quantityRegex.test(value)) {
        setFormData((prev) => ({ ...prev, quantity: value }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = productSchema.safeParse(formData);

    if (result.success) {
      setErrors({ name: '', article: '', price: '', quantity: '' });
      await onSave(result.data);
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors = {
        name: fieldErrors.name?.[0] ?? '',
        article: fieldErrors.article?.[0] ?? '',
        price: fieldErrors.price?.[0] ?? '',
        quantity: fieldErrors.quantity?.[0] ?? '',
      };
      setErrors(newErrors);

      if (newErrors.name) {
        nameInputRef.current?.focus();
      } else if (newErrors.article) {
        articleInputRef.current?.focus();
      } else if (newErrors.price) {
        priceInputRef.current?.focus();
      } else if (newErrors.quantity) {
        quantityInputRef.current?.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl text-gray-700 font-bold mb-4">
        {product ? 'Редактировать товар' : 'Добавить товар'}
      </h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Название:
        </label>
        <Input
          inputRef={nameInputRef}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Введите название товара"
          disabled={isSaving}
        />
        {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="article" className="block text-gray-700 text-sm font-bold mb-2">
          Артикул:
        </label>
        <Input
          inputRef={articleInputRef}
          type="text"
          id="article"
          name="article"
          value={formData.article}
          onChange={handleChange}
          placeholder="Введите артикул товара"
          disabled={isSaving}
        />
        {errors.article && <p className="text-red-500 text-xs italic">{errors.article}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
          Цена:
        </label>
        <Input
          inputRef={priceInputRef}
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Введите цену (например, 100.50)"
          disabled={isSaving}
        />
        {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
          Количество:
        </label>
        <Input
          inputRef={quantityInputRef}
          type="text"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Введите количество (например, 10)"
          disabled={isSaving}
        />
        {errors.quantity && <p className="text-red-500 text-xs italic">{errors.quantity}</p>}
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
