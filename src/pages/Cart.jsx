import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';
import useAuthStore from '@/store/useAuthStore';
import { orderAPI, cartAPI } from '@/services/api';
import { formatDateTime } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

export function Cart() {
  const { t } = useTranslation();
  const { isAuthenticated, setAuthModal } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  const [lastCartSnapshot, setLastCartSnapshot] = useState(null);

  // Fetch Cart from backend
  const { data: cartResponse, isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    enabled: isAuthenticated, // Only fetch if logged in
  });

  const cartItems = cartResponse?.cartItems || [];
  const displayItems = (showOrderModal && lastCartSnapshot) ? lastCartSnapshot : cartItems;

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
      toast.info(t("Mahsulot savatdan olib tashlandi"));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      handleApiError(error, t("Olib tashlashda xatolik"));
    }
  });

  const orderMutation = useMutation({
    mutationFn: orderAPI.placeOrder,
    onSuccess: (data) => {
      setLastOrderDetails({
        id: data?.id,
        totalAmount: data?.totalAmount || data?.orderItems?.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0) || 0,
        orderDate: data?.orderDate,
        orderItems: data?.orderItems || []
      });
      setShowOrderModal(true);
      toast.success(t("Buyurtma muvaffaqiyatli rasmiylashtirildi!"));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (error) => {
      handleApiError(error, t("Buyurtma berishda xatolik."));
    }
  });

  const updateQuantity = (productId, currentQuantity, delta) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  const removeItem = (productId) => {
    removeItemMutation.mutate({ productId });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) return setAuthModal('login');
    if (cartItems.length === 0) return toast.error(t("Savat bo'sh"));
    
    setLastCartSnapshot(cartItems);
    orderMutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground/50">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">{t("Savatingizni ko'rish uchun tizimga kiring")}</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          {t("Savatingizni ko'rish va boshqarish uchun tizimga kirishingiz kerak.")}
        </p>
        <Button size="lg" onClick={() => setAuthModal('login')}>{t("Kirish")}</Button>
      </div>
    );
  }

  if (isCartLoading) {
    return (
      <div className="container mx-auto p-4 md:py-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
          <div><Skeleton className="h-64 w-full" /></div>
        </div>
      </div>
    );
  }

  const renderOrderModal = () => (
    <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center shrink-0 mb-2">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-2xl mb-2">{t("Buyurtma tasdiqlandi!")}</DialogTitle>
              <DialogDescription className="text-base">
                {t("Xaridingiz uchun tashakkur.")}
                {lastOrderDetails?.id && <div className="font-semibold text-foreground mt-2 bg-muted py-2 rounded-md">{t("Buyurtma")} ID: #{lastOrderDetails.id}</div>}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-2 space-y-4 text-sm mt-2 border-t pt-4">
          <div className="flex justify-between text-muted-foreground mb-4">
            <span>{t("Sana:")}</span>
            <span>{lastOrderDetails?.orderDate ? formatDateTime(lastOrderDetails.orderDate) : formatDateTime(new Date())}</span>
          </div>

          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <ShoppingBag className="h-4 w-4 text-primary" /> {t("Xarid qilingan mahsulotlar")}
          </h4>
          
          <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto pr-2">
            {lastOrderDetails?.orderItems?.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between items-start text-sm border-b pb-2 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center font-bold text-muted-foreground shrink-0 overflow-hidden">
                    {item.product?.img_url ? (
                      <img src={item.product.img_url} alt={item.product?.name} className="w-full h-full object-cover" />
                    ) : (
                      item.product?.name ? item.product.name.charAt(0) : 'P'
                    )}
                  </div>
                  <div>
                    <p className="font-medium line-clamp-1">{item.product?.name || `Product ID: ${item.productId || item.product?.id}`}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity} x ${Number(item.price || item.product?.price || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="font-semibold">
                  ${(Number(item.price || item.product?.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-muted-foreground bg-muted/50 p-3 rounded-md mt-4">
            <span>{t("Jami to'langan summa")}</span>
            <span className="font-bold text-foreground text-lg">${Number(lastOrderDetails?.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowOrderModal(false)}>
            {t("Yopish")}
          </Button>
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground" onClick={() => {
            setShowOrderModal(false);
            navigate('/orders');
          }}>
            {t("Barcha buyurtmalarni ko'rish")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (displayItems.length === 0) {
    return (
      <>
        <div className="container mx-auto p-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground/50">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">{t("Savatingiz bo'sh")}</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            {t("Siz hali savatga hech narsa qo'shmagan ko'rinasiz. Buni o'zgartiramiz!")}
          </p>
          <Link to="/">
            <Button size="lg">{t("Xaridni boshlash")}</Button>
          </Link>
        </div>
        {renderOrderModal()}
      </>
    );
  }

  const subtotal = displayItems.reduce((sum, item) => sum + (Number(item.product?.price || 0) * item.quantity), 0);
  const total = subtotal;

  return (
    <div className="container mx-auto p-4 md:py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t("Xarid savati")}</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {displayItems.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden">
              <div className="w-full sm:w-32 h-32 bg-muted flex-shrink-0 flex items-center justify-center text-4xl font-bold text-primary/20 overflow-hidden">
                {item.product?.img_url ? (
                  <img src={item.product.img_url} alt={item.product?.name} className="w-full h-full object-cover" />
                ) : (
                  item.product?.name ? item.product.name.charAt(0) : 'P'
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{item.product?.name || t("Noma'lum mahsulot")}</h3>
                  <div className="font-bold text-lg">
                    ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  ${Number(item.product?.price || 0).toFixed(2)} / {t("dona")}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center space-x-2 border rounded-md w-fit">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none" 
                      onClick={() => updateQuantity(item.product.id, item.quantity, -1)}
                      disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none" 
                      onClick={() => updateQuantity(item.product.id, item.quantity, 1)}
                      disabled={updateQuantityMutation.isPending}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                    onClick={() => removeItem(item.product.id)}
                    disabled={removeItemMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div>
          <Card className="sticky top-24 bg-card/50 backdrop-blur border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>{t("Buyurtma xulosasi")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Oraliq summa")} ({displayItems.length} {t("ta mahsulot")})</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Yetkazib berish")}</span>
                <span className="font-medium text-green-600">{t("Bepul")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Soliq")}</span>
                <span className="font-medium">$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>{t("Jami summa")}</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full text-lg h-12" 
                onClick={handleCheckout}
                disabled={orderMutation.isPending || cartItems.length === 0}
              >
                {orderMutation.isPending ? t("Jarayonda...") : t("Xaridni rasmiylashtirish")}
                {!orderMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {renderOrderModal()}
    </div>
  );
}
