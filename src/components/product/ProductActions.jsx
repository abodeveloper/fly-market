import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ProductActions({ product }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAuthenticated, setAuthModal } = useAuthStore();

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    enabled: isAuthenticated,
  });
  
  const cartItems = cartData?.cartItems || [];

  const addToCartMutation = useMutation({
    mutationFn: (productId) => cartAPI.addToCart({ productId }),
    onSuccess: () => {
      toast.success(`${product?.name} ${t("savatga qo'shildi!")}`);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error(t("Savatga narsa qo'shish uchun tizimga kiring."));
      } else {
        handleApiError(error, t("Savatga qo'shishda xatolik"));
      }
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: (data) => cartAPI.updateCartItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      handleApiError(error, t("Miqdorni yangilashda xatolik"));
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (data) => cartAPI.removeFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      handleApiError(error, t("Olib tashlashda xatolik"));
    }
  });

  const updateQuantity = (productId, currentQuantity, delta) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  const removeItem = (productId) => {
    removeItemMutation.mutate({ productId });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) return setAuthModal('login');
    addToCartMutation.mutate(Number(product.id));
  };

  const inCart = cartItems.find(item => item.product?.id === Number(product.id) || item.productId === Number(product.id));

  return (
    <div className="pt-6 border-t border-border/40 mt-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {(() => {
          if (product?.stock === 0 && !inCart) {
            return (
               <Button 
                size="lg" 
                className="w-full sm:w-[280px] h-12 text-base font-bold rounded-xl" 
                disabled
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t("Sotuvda yo'q")}
              </Button>
            );
          }
          
          if (inCart) {
            return (
              <div className="flex flex-col gap-4 w-full sm:w-[280px]">
                {/* Quantity Control UI */}
                <div className="flex items-center p-1 bg-muted/50 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-xl hover:bg-background hover:shadow-sm"
                    onClick={() => updateQuantity(product.id, inCart.quantity, -1)}
                    disabled={inCart.quantity <= 1 || updateQuantityMutation.isPending}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="flex-1 text-center font-bold text-sm select-none w-10">
                    {inCart.quantity}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="inline-block">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-xl hover:bg-background hover:shadow-sm"
                          onClick={() => updateQuantity(product.id, inCart.quantity, 1)}
                          disabled={updateQuantityMutation.isPending || inCart.quantity >= product.stock}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {inCart.quantity >= product.stock && (
                      <TooltipContent side="top">
                        <p>{t("Sotuvda boshqa qolmadi")}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
                
                {/* Action Buttons UI */}
                <div className="flex items-center gap-3 w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0 text-destructive border-transparent hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors focus:ring-0 rounded-xl shadow-sm bg-muted/50"
                    onClick={() => removeItem(product.id)}
                    disabled={removeItemMutation.isPending}
                    title={t("Savatdan olib tashlash")}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold shadow-none transition-colors rounded-xl"
                    asChild
                  >
                    <Link to="/cart">
                      {t("Savatga o'tish")}
                    </Link>
                  </Button>
                </div>
              </div>
            )
          }

          return (
            <Button 
              size="lg" 
              className="w-full sm:w-[280px] h-12 text-base font-bold rounded-xl" 
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t("Savatga qo'shish")}
            </Button>
          )
        })()}
      </div>
    </div>
  );
}
