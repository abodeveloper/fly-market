import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/useAuthStore';
import { orderAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, CheckCircle2, Clock } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

export function Orders() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderAPI.getOrders,
    enabled: !!isAuthenticated, // Keeping enabled check just to be safe
  });

  return (
    <div className="container mx-auto p-4 md:py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("Buyurtmalarim")}</h1>
        <p className="text-muted-foreground">{t("Barcha xaridlaringizni ko'rib chiqing va boshqaring.")}</p>
      </div>

      <div className="grid gap-6">
        {isOrdersLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : orders?.length > 0 ? (
          orders.map((order, index) => (
            <Card key={order.id || index} className="overflow-hidden hover:shadow-sm transition-shadow">
              <CardContent className="p-4 md:p-5">
                <div className="flex justify-between items-center gap-3 border-b pb-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-primary" />
                      {t("Buyurtma")} #{order.id}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Sana:")} {formatDateTime(order.orderDate || new Date())}
                    </p>
                  </div>
                  <div>
                    {order.status === 'delivered' ? (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('Yetkazildi')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-md uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {t('Kutilmoqda')}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">{t("Buyurtma mahsulotlari")}</h4>
                  {order.orderItems?.length > 0 ? (
                    <div className="grid gap-3">
                      {order.orderItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden">
                              {item.product?.img_url ? (
                                <img src={item.product.img_url} alt={item.product?.name} className="w-full h-full object-cover" />
                              ) : (
                                item.product?.name ? item.product.name.charAt(0) : 'P'
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm leading-none mb-1">{item.product?.name || `Product ID: ${item.productId}`}</p>
                              <p className="text-xs text-muted-foreground leading-none">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="font-semibold">
                            ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t("Ushbu buyurtma uchun mahsulotlar topilmadi.")}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t flex justify-between items-center text-base">
                  <span className="font-semibold text-muted-foreground">{t("Jami")}</span>
                  <span className="font-extrabold text-foreground">
                    ${Number(order.totalAmount || (order.orderItems || []).reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0)).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-card/50">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">{t("Buyurtmalar topilmadi")}</h3>
            <p>{t("Siz hali hech qanday buyurtma bermagansiz.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
