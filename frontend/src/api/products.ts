import axios from 'axios';
import { Product } from '@shared/interfaces/product.interface';

const API_URL = '/api/products';

interface ProductsResponse {
  data: Product[];
  total: number;
}

export const getProducts = async (
  page: number,
  limit: number,
  searchTerm?: string,
): Promise<ProductsResponse> => {
  const response = await axios.get(API_URL, {
    params: { page, limit, search: searchTerm },
  });
  return response.data;
};

export const createProduct = async (
  product: Omit<Product, 'id' | 'createdAt'>,
): Promise<Product> => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (
  id: number,
  product: Omit<Product, 'id' | 'createdAt'>,
): Promise<Product> => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
