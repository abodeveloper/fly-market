import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../services/api';

// Hook to fetch all products
export const useGetProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productAPI.getProducts(filters),
    keepPreviousData: true,
  });
};

// Hook to fetch a single product
export const useGetProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id),
    enabled: !!id, // Only fetch if ID exists
  });
};
