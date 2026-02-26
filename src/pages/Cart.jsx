import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle2, Package, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/formatPrice';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { handleApiError } from '@/utils/errorHandler';
import { orderAPI } from '@/services/api';
import { formatDateTime } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import useAuthStore from '@/store/useAuthStore';

export function Cart() {
  const { t } = useTranslation();
  const { isAuthenticated, setAuthModal } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);
  const [lastCartSnapshot, setLastCartSnapshot] = useState(null);

  const { cartItems, isCartLoading, updateQuantity, removeItem, isUpdating, isRemoving } = useCart();
  const displayItems = (showOrderModal && lastCartSnapshot) ? lastCartSnapshot : cartItems;

  const orderMutation = useMutation({
    mutationFn: orderAPI.placeOrder,
    onSuccess: (data) => {
      setLastOrderDetails({
        id: data?.id,
        totalAmount: data?.totalAmount || data?.orderItems?.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0) || 0,
        orderDate: data?.orderDate,
        orderItems: data?.orderItems || []
      });
      setLastCartSnapshot(cartItems);
      setShowOrderModal(true);
      toast.success(t("Buyurtma muvaffaqiyatli rasmiylashtirildi!"));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (error) => { handleApiError(error, t("Buyurtma berishda xatolik.")); }
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) return toast.error(t("Savat bo'sh"));
    setLastCartSnapshot(cartItems);
    orderMutation.mutate();
  };

  // --- States ---
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 py-24 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center text-muted-foreground/40">
          <ShoppingBag className="w-14 h-14" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("Savatingizni ko'rish uchun tizimga kiring")}</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">{t("Savatingizni ko'rish va boshqarish uchun tizimga kirishingiz kerak.")}</p>
        </div>
        <Button size="lg" className="h-12 px-8 rounded-xl" onClick={() => setAuthModal('login')}>{t("Kirish")}</Button>
      </div>
    );
  }

  if (isCartLoading) {
    return (
      <div className="container mx-auto p-4 md:py-8 space-y-6">
        <Skeleton className="h-9 w-44" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const renderOrderModal = () => (
    <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center shrink-0 ring-8 ring-green-100/50 dark:ring-green-900/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <DialogTitle className="text-2xl mb-1">{t("Buyurtma tasdiqlandi!")}</DialogTitle>
              <DialogDescription className="text-base">{t("Xaridingiz uchun tashakkur.")}</DialogDescription>
              {lastOrderDetails?.id && (
                <div className="mt-3 inline-flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full text-sm font-semibold text-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  {t("Buyurtma")} #{lastOrderDetails.id}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t("Sana:")}</span>
            <span>{lastOrderDetails?.orderDate ? formatDateTime(lastOrderDetails.orderDate) : formatDateTime(new Date())}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Package className="h-4 w-4 text-primary" />
            {t("Xarid qilingan mahsulotlar")}
          </div>
          <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
            {lastOrderDetails?.orderItems?.map((item, idx) => (
              <div key={item.id || idx} className="flex items-center gap-3 text-sm bg-muted/50 rounded-xl p-2.5">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center font-bold text-muted-foreground shrink-0 overflow-hidden">
                  {item.product?.img_url ? (
                    <img src={item.product.img_url} alt={item.product?.name} className="w-full h-full object-cover" />
                  ) : (
                    item.product?.name?.charAt(0) || 'P'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{item.product?.name || `Product #${item.productId}`}</p>
                  <p className="text-muted-foreground text-xs">{item.quantity} × {formatPrice(item.price || item.product?.price || 0, t)}</p>
                </div>
                <span className="font-bold shrink-0">{formatPrice((item.price || item.product?.price || 0) * item.quantity, t)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center bg-primary/5 border border-primary/10 p-4 rounded-xl">
            <span className="text-sm font-semibold">{t("Jami to'langan summa")}</span>
            <span className="font-black text-xl text-primary">{formatPrice(lastOrderDetails?.totalAmount || 0, t)}</span>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto rounded-xl" onClick={() => setShowOrderModal(false)}>
            {t("Yopish")}
          </Button>
          <Button className="w-full sm:w-auto rounded-xl" onClick={() => { setShowOrderModal(false); navigate('/orders'); }}>
            {t("Barcha buyurtmalarni ko'rish")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (displayItems.length === 0) {
    return (
      <>
        <div className="container mx-auto p-4 py-24 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center text-muted-foreground/40">
            <ShoppingBag className="w-14 h-14" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("Savatingiz bo'sh")}</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">{t("Siz hali savatga hech narsa qo'shmagan ko'rinasiz. Buni o'zgartiramiz!")}</p>
          </div>
          <Button size="lg" className="h-12 px-8 rounded-xl" asChild>
            <Link to="/">{t("Xaridni boshlash")}</Link>
          </Button>
        </div>
        {renderOrderModal()}
      </>
    );
  }

  const subtotal = displayItems.reduce((sum, item) => sum + (Number(item.product?.price || 0) * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t("Xarid savati")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{displayItems.length} {t("ta mahsulot")}</p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1.5 rounded-full">
          {displayItems.reduce((sum, i) => sum + i.quantity, 0)} {t("dona")}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {displayItems.map((item) => (
            <div key={item.id} className="flex gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center text-3xl font-black text-muted-foreground/10">
                {item.product?.img_url ? (
                  <img src={item.product.img_url} alt={item.product?.name} className="w-full h-full object-cover" />
                ) : (
                  item.product?.name?.charAt(0) || 'P'
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="font-bold text-base line-clamp-1 mb-0.5">{item.product?.name || t("Noma'lum mahsulot")}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.product?.price || 0, t)} / {t("dona")}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                  {/* Quantity control */}
                  <div className="flex items-center p-1 bg-muted/50 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-xl hover:bg-background hover:shadow-sm disabled:opacity-50"
                      onClick={() => updateQuantity(item.product.id, item.quantity, -1)}
                      disabled={isUpdating || item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-sm select-none">{item.quantity}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="inline-block">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-xl hover:bg-background hover:shadow-sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity, 1)}
                            disabled={isUpdating || item.quantity >= item.product?.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {item.quantity >= item.product?.stock && (
                        <TooltipContent side="top">
                          <p>{t("Sotuvda boshqa qolmadi")}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>

                  {/* Right: total + trash */}
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-foreground">
                      {formatPrice((item.product?.price || 0) * item.quantity, t)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      onClick={() => removeItem(item.product.id)}
                      disabled={isRemoving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="sticky top-24">
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h2 className="font-bold text-lg">{t("Buyurtma xulosasi")}</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Oraliq summa")} ({displayItems.length} {t("ta mahsulot")})</span>
                <span className="font-semibold">{formatPrice(subtotal, t)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Yetkazib berish")}</span>
                <span className="font-semibold text-green-600">{t("Bepul")}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-base">{t("Jami summa")}</span>
                <span className="font-black text-2xl text-primary">{formatPrice(subtotal, t)}</span>
              </div>
            </div>
            <div className="p-5 pt-0">
              <Button
                className="w-full h-12 text-base font-bold rounded-xl"
                onClick={handleCheckout}
                disabled={orderMutation.isPending || cartItems.length === 0}
              >
                {orderMutation.isPending ? t("Jarayonda...") : t("Xaridni rasmiylashtirish")}
                {!orderMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">{t("Bepul yetkazib berish barcha buyurtmalar uchun.")}</p>
            </div>
          </div>
        </div>
      </div>

      {renderOrderModal()}
    </div>
  );
}
