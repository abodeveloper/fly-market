import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewAPI, orderAPI } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';
import { useTranslation } from 'react-i18next';

export function ProductReviews({ productId }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAuthenticated, setAuthModal } = useAuthStore();
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState('5');
  const [hoverRating, setHoverRating] = useState(0);

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewAPI.getProductReviews(productId),
  });

  const { data: myOrders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderAPI.getOrders,
    enabled: isAuthenticated,
  });

  const hasPurchased = myOrders?.some(order => 
    order.orderItems?.some(item => 
      item.product?.id === Number(productId) || item.productId === Number(productId)
    )
  );

  const reviewMutation = useMutation({
    mutationFn: reviewAPI.createReview,
    onSuccess: () => {
      toast.success(t("Sharh yuborildi!"));
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: (error) => {
      handleApiError(error, t("Sharh yuborishda xatolik"));
    }
  });

  const submitReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setAuthModal('login');
    
    reviewMutation.mutate({
      productId: Number(productId),
      rating: Number(reviewRating),
      comment: reviewComment
    });
  };

  return (
    <div className="border-t pt-12">
      <h2 className="text-2xl font-bold mb-8">{t("Mijozlar sharhlari")}</h2>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isReviewsLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : reviews?.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">User {review.userId}</span>
                  </div>
                  {review.createdAt && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDateTime(review.createdAt)}
                    </span>
                  )}
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">{t("Hali sharhlar yo'q. Birinchi bo'lib sharh qoldiring!")}</p>
          )}
        </div>
        
        <div className="bg-muted/50 p-6 rounded-xl h-fit border">
          <h3 className="text-lg font-semibold mb-4">{t("Sharh yozish")}</h3>
          {!isAuthenticated ? (
            <div className="text-center py-6">
              <p className="mb-4 text-sm text-muted-foreground">{t("Sharh yozish uchun tizimga kirishingiz kerak.")}</p>
              <Button variant="outline" className="w-full" onClick={() => setAuthModal('login')}>{t("Sharh yozish uchun kirish")}</Button>
            </div>
          ) : isOrdersLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : hasPurchased === false ? (
            <div className="text-center py-6 bg-background rounded border border-dashed border-primary/20">
              <p className="text-sm text-muted-foreground">{t("Siz faqat haqiqatdan ham xarid qilgan mahsulotlaringizgagina sharh yoza olasiz.")}</p>
            </div>
          ) : (
            <form onSubmit={submitReview} className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">{t("Baho")}</label>
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star.toString())}
                      onMouseEnter={() => setHoverRating(star)}
                      className={`transition-all duration-200 hover:scale-110 focus:outline-none ${
                        star <= (hoverRating || Number(reviewRating))
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted-foreground/30'
                      }`}
                    >
                      <Star className="h-6 w-6" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Sizning sharhingiz")}</label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={t("Mahsulot haqida fikringizni yozing...")}
                  className="resize-none min-h-[120px] bg-background border-border/50 focus-visible:ring-primary/20"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-bold shadow-sm"
                disabled={reviewMutation.isPending || !reviewComment.trim()}
              >
                {t("Sharh yuborish")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
