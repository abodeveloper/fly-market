import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { reviewAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Star } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

export function Reviews() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewAPI.getReviewsByUserId(),
    enabled: !!isAuthenticated,
  });

  return (
    <div className="container mx-auto p-4 md:py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("Sharhlarim")}</h1>
        <p className="text-muted-foreground">{t("Siz yozgan barcha mahsulot sharhlarini boshqaring va ko'ring.")}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isReviewsLoading ? (
          <div className="col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        ) : reviews?.length > 0 ? (
          reviews.map((review, index) => (
            <Card key={review.id || index} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
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
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground flex items-center justify-between">
                  <span className="font-medium">{review.product?.name || `Product ID: ${review.product?.id}`}</span>
                  <span>{formatDateTime(review.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-card/50">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">{t("Sharhlar yozilmagan")}</h3>
            <p>{t("Siz hali hech qanday mahsulotga sharh yozmagansiz.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
