import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, reviewAPI, cartAPI, orderAPI } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

export function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, setAuthModal } = useAuthStore();
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState('5');
  const [hoverRating, setHoverRating] = useState(0);
  
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id),
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewAPI.getProductReviews(id),
  });

  const reviewMutation = useMutation({
    mutationFn: reviewAPI.createReview,
    onSuccess: () => {
      toast.success(t("Sharh yuborildi!"));
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
    onError: (error) => {
      handleApiError(error, t("Sharh yuborishda xatolik"));
    }
  });

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

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    enabled: isAuthenticated,
  });
  const cartItems = cartData?.cartItems || [];

  const { data: myOrders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderAPI.getOrders,
    enabled: isAuthenticated,
  });

  const hasPurchased = myOrders?.some(order => 
    order.orderItems?.some(item => 
      item.product?.id === Number(id) || item.productId === Number(id)
    )
  );

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
    addToCartMutation.mutate(Number(id));
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setAuthModal('login');
    
    reviewMutation.mutate({
      productId: Number(id),
      rating: Number(reviewRating),
      comment: reviewComment
    });
  };

  if (isProductLoading) return (
    <div className="container mx-auto p-4 space-y-8">
      <Skeleton className="h-8 w-32" />
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-96 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="container mx-auto p-4 text-center">{t("Mahsulot topilmadi")}</div>;

  return (
    <div className="container mx-auto p-4 md:py-8 space-y-12">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("Mahsulotlarga qaytish")}
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center relative overflow-hidden text-9xl font-bold text-primary/20">
          {product.img_url ? (
            <img src={product.img_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            product.name.charAt(0)
          )}
        </div>
        
        <div className="flex flex-col space-y-6">
          <div>
            <div className="text-sm font-medium text-primary mb-2">{t("Kategoriya")}: {product.categoryId}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{product.name}</h1>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              ${Number(product.price).toFixed(2)}
            </div>
          </div>
          
          <div className="prose dark:prose-invert">
            <h3 className="text-lg font-semibold mb-2">{t("Ta'rif")}</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="pt-6 border-t mt-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-muted-foreground">{t("Mavjudligi:")}</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} ${t("ta mavjud")}` : t("Sotuvda yo'q")}
              </span>
            </div>
            
            {(() => {
              const cartItem = cartItems.find(item => item.product.id === product.id);
              if (cartItem) {
                return (
                  <div className="flex flex-col gap-3 w-full sm:w-[280px]">
                    {/* Quantity UI */}
                    <div className="flex items-center justify-between w-full h-12 border-2 rounded-xl overflow-hidden bg-background shadow-sm">
                      <Button 
                        variant="ghost" 
                        className="h-full rounded-none px-4 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50" 
                        onClick={() => updateQuantity(product.id, cartItem.quantity, -1)}
                        disabled={cartItem.quantity <= 1 || updateQuantityMutation.isPending}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="flex-1 text-center text-lg font-bold">{cartItem.quantity}</span>
                      <Button 
                        variant="ghost" 
                        className="h-full rounded-none px-4 text-muted-foreground hover:text-foreground hover:bg-muted" 
                        onClick={() => updateQuantity(product.id, cartItem.quantity, 1)}
                        disabled={updateQuantityMutation.isPending}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
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
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock === 0 ? t("Sotuvda yo'q") : t("Savatga qo'shish")}
                </Button>
              )
            })()}
          </div>
        </div>
      </div>
      
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
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
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
                            ? 'text-yellow-500 fill-current'
                            : 'text-muted-foreground/30'
                        }`}
                      >
                        <Star className="h-6 w-6" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Izoh")}</label>
                  <Textarea 
                    placeholder={t("Sizga nima yoqdi yoki yoqmadi?")} 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={reviewMutation.isPending}>
                  {reviewMutation.isPending ? t("Yuborilmoqda...") : t("Sharhni yuborish")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
