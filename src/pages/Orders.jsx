import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { orderAPI } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, CheckCircle2, Clock, ShoppingBag, ArrowLeft } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { useTranslation } from 'react-i18next';

function StatusBadge({ status, t }) {
  if (status === 'delivered') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full uppercase tracking-wider">
        <CheckCircle2 className="w-3 h-3" />
        {t('Yetkazildi')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full uppercase tracking-wider">
      <Clock className="w-3 h-3" />
      {t('Kutilmoqda')}
    </span>
  );
}

export function Orders() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderAPI.getOrders,
    enabled: !!isAuthenticated,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t("Buyurtmalarim")}</h1>
          <p className="text-xs text-muted-foreground">{t("Barcha xaridlaringizni ko'rib chiqing va boshqaring.")}</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
        </div>
      ) : orders?.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const total = Number(order.totalAmount ||
              (order.orderItems || []).reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0)
            );
            return (
              <div key={order.id || index} className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Order header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-bold text-sm">{t("Buyurtma")} #{order.id}</span>
                  </div>
                  <StatusBadge status={order.status} t={t} />
                </div>

                {/* Date */}
                <div className="px-4 pt-2.5 pb-1">
                  <p className="text-[11px] text-muted-foreground">
                    {formatDateTime(order.orderDate || new Date())}
                  </p>
                </div>

                {/* Products */}
                <div className="px-4 pb-3 space-y-2 mt-1">
                  {order.orderItems?.length > 0 ? (
                    order.orderItems.map((item, i) => (
                      <Link
                        key={i}
                        to={item.product?.id ? `/product/${item.product.id}` : '#'}
                        className="flex items-center gap-3 group/item rounded-xl transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 overflow-hidden border border-border/50">
                          {item.product?.img_url ? (
                            <img src={item.product.img_url} alt={item.product?.name} className="w-full h-full object-cover" />
                          ) : (
                            item.product?.name?.charAt(0) || 'P'
                          )}
                        </div>
                        {/* Name + qty */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate group-hover/item:text-primary transition-colors">{item.product?.name || `Product #${item.productId}`}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} {t("dona")}</p>
                        </div>
                        {/* Price */}
                        <span className="text-sm font-bold shrink-0">
                          {formatPrice((item.price || 0) * item.quantity, t)}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{t("Ushbu buyurtma uchun mahsulotlar topilmadi.")}</p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center px-4 py-3 bg-muted/20 border-t border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("Jami summa")}</span>
                  <span className="font-black text-base text-primary">
                    {formatPrice(total, t)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">{t("Buyurtmalar topilmadi")}</h3>
            <p className="text-sm text-muted-foreground">{t("Siz hali hech qanday buyurtma bermagansiz.")}</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-primary hover:underline">{t("Xaridni boshlash")} →</Link>
        </div>
      )}
    </div>
  );
}
