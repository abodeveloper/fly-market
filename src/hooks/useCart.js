import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';
import { useTranslation } from 'react-i18next';

/**
 * Cart logikasi uchun custom hook.
 * @param {string} productName - "Savatga qo'shildi" toast uchun mahsulot nomi (ixtiyoriy)
 */
export function useCart(productName = '') {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAuthenticated, setAuthModal } = useAuthStore();

  // ─── Cart data ────────────────────────────────────────────────────────────
  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    enabled: !!isAuthenticated,
  });

  const cartItems = cartData?.cartItems || [];

  // ─── Mutations ────────────────────────────────────────────────────────────
  const addToCartMutation = useMutation({
    mutationFn: (productId) => cartAPI.addToCart({ productId }),
    onSuccess: () => {
      toast.success(`${productName} ${t("savatga qo'shildi!")}`);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error(t("Savatga narsa qo'shish uchun tizimga kiring."));
      } else {
        handleApiError(error, t("Savatga qo'shishda xatolik"));
      }
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: (data) => cartAPI.updateCartItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      handleApiError(error, t('Miqdorni yangilashda xatolik'));
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (data) => cartAPI.removeFromCart(data),
    onSuccess: () => {
      toast.info(t('Mahsulot savatdan olib tashlandi'));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      handleApiError(error, t('Olib tashlashda xatolik'));
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const addToCart = (productId) => {
    if (!isAuthenticated) return setAuthModal('login');
    addToCartMutation.mutate(Number(productId));
  };

  const updateQuantity = (productId, currentQuantity, delta) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  const removeItem = (productId) => {
    removeItemMutation.mutate({ productId });
  };

  const getCartItem = (productId) =>
    cartItems.find(
      (item) => item.product?.id === Number(productId) || item.productId === Number(productId)
    );

  return {
    // Data
    cartItems,
    cartData,
    isCartLoading,

    // Actions
    addToCart,
    updateQuantity,
    removeItem,
    getCartItem,

    // Loading states
    isAdding: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
  };
}
