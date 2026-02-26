import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { reviewAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Star, ArrowLeft } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

export function Reviews() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewAPI.getReviewsByUserId(),
    enabled: !!isAuthenticated,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">

      {/* Header — Orders.jsx kabi */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t("Sharhlarim")}</h1>
          <p className="text-xs text-muted-foreground">{t("Siz yozgan barcha mahsulot sharhlarini boshqaring va ko'ring.")}</p>
        </div>
      </div>

      {/* Cards grid — asl tuzilma */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
          </div>
        ) : reviews?.length > 0 ? (
          reviews.map((review, index) => (
            <Card key={review.id || index} className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col rounded-2xl py-2">
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex space-x-1 items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 px-3 py-1 rounded-full text-xs font-bold">
                    <span>{review.rating}</span>
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <Link to={`/product/${review.product?.id}`} className="text-xs font-medium text-primary hover:underline">
                    {t("Mahsulotni ko'rish")}
                  </Link>
                </div>
                <p className="text-sm flex-1 leading-relaxed text-foreground">
                  "{review.comment}"
                </p>
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{review.product?.name || `Product #${review.product?.id}`}</span>
                  <span className="shrink-0">{formatDateTime(review.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
              <MessageSquare className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">{t("Sharhlar yozilmagan")}</h3>
              <p className="text-sm text-muted-foreground">{t("Siz hali hech qanday mahsulotga sharh yozmagansiz.")}</p>
            </div>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">{t("Mahsulotlarni ko'rish")} →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
