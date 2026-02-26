import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { productAPI, categoryAPI, cartAPI } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';
import { Minus, Plus, Trash2, ShoppingCart, Search, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatPrice } from '@/utils/formatPrice';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export function ProductsSection() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAuthenticated, setAuthModal } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryAPI.getCategories,
  });

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', { sort: sortOrder, categoryId: selectedCategory, productName: searchTerm }],
    queryFn: () => productAPI.getProducts({ 
      sort: sortOrder === 'default' ? '' : sortOrder, 
      categoryId: selectedCategory === 'all' ? '' : selectedCategory, 
      productName: searchTerm 
    }),
  });

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    enabled: isAuthenticated,
  });
  const cartItems = cartData?.cartItems || [];

  const addToCartMutation = useMutation({
    mutationFn: (productId) => cartAPI.addToCart({ productId }),
    onSuccess: (_, productId) => {
      const addedProduct = productsData?.find(p => p.id === productId);
      toast.success(`${addedProduct?.name || 'Product'} added to cart!`);
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

  const handleAddToCart = (product) => {
    if (!isAuthenticated) return setAuthModal('login');
    addToCartMutation.mutate(product.id);
  };

  const products = productsData || [];

  return (
    <section id="products" className="scroll-mt-16 pt-4 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Categories Carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">{t("Kategoriyalar")}</h2>
          </div>
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-4 h-full pb-4 pt-1">

              {!isLoadingCategories && categories?.map((cat) => (
                <CarouselItem key={cat.id} className="pl-4 basis-[200px] sm:basis-[240px]">
                  <div 
                    onClick={() => setSelectedCategory(cat.id.toString())}
                    className={`h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col group ${
                      selectedCategory === cat.id.toString() 
                        ? 'ring-2 ring-primary border-transparent shadow-lg bg-card' 
                        : 'border border-border bg-card hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    <div className="h-32 bg-muted relative overflow-hidden flex items-center justify-center">
                      {cat.img_url ? (
                        <img src={cat.img_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-4xl font-black text-primary/20">{cat.name.charAt(0)}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg leading-tight mb-1.5 line-clamp-1">{cat.name}</h3>
                      {cat.description ? (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{cat.description}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">{t("Ta'rif yo'q")}</p>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
              
              {isLoadingCategories && [1, 2, 3, 4].map(i => (
                 <CarouselItem key={`skel-${i}`} className="pl-4 basis-[200px] sm:basis-[240px]">
                   <div className="h-full rounded-2xl overflow-hidden border border-border bg-card">
                     <Skeleton className="h-32 w-full rounded-none" />
                     <div className="p-4 space-y-2">
                       <Skeleton className="h-5 w-3/4" />
                       <Skeleton className="h-3 w-full" />
                       <Skeleton className="h-3 w-1/2" />
                     </div>
                   </div>
                 </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-center max-w-5xl mx-auto mb-6 px-2">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-2">
            {t("Barcha kerakli narsalar bitta joyda")}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {t("Eng sara mahsulotlarni qulay narxlarda xarid qiling.")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 mb-12 bg-card p-3 md:p-2 rounded-2xl md:rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-border/60 max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="relative w-full flex-1 flex items-center md:mb-0 bg-muted/30 md:bg-transparent rounded-xl md:rounded-none">
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder={t("Mahsulotlarni qidirish...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 md:h-11 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base"
            />
          </div>

          {/* Filters Wrapper */}
          <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center gap-3 md:gap-0 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0">
            {/* Category Select */}
            <div className="w-full md:flex-1 md:w-[220px] md:pr-2 md:pl-2 bg-muted/30 md:bg-transparent rounded-xl md:rounded-none">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 md:h-11 border-0 shadow-none focus:ring-0 bg-transparent font-medium w-full">
                  <SelectValue placeholder={t("Barcha kategoriyalar")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("Barcha kategoriyalar")}</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort Select */}
            <div className="w-full md:flex-1 md:w-[200px] md:border-l border-border/60 md:pl-2 bg-muted/30 md:bg-transparent rounded-xl md:rounded-none">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-12 md:h-11 border-0 shadow-none focus:ring-0 bg-transparent font-medium w-full">
                  <SelectValue placeholder={t("Odatiy tartib")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("Odatiy tartib")}</SelectItem>
                  <SelectItem value="price">{t("Arzonroq")}</SelectItem>
                  <SelectItem value="-price">{t("Qimmatroq")}</SelectItem>
                  <SelectItem value="name">{t("Nomi bo'yicha (A-Z)")}</SelectItem>
                  <SelectItem value="-name">{t("Nomi bo'yicha (Z-A)")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      {isLoadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="aspect-[16/10] w-full rounded-xl bg-muted/50" />
              <div className="space-y-2 px-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 bg-card rounded-2xl p-0 gap-0">
              <div className="aspect-[16/10] bg-muted/50 relative flex items-center justify-center overflow-hidden p-4">
                {/* Category badge - top left */}
                <div className="absolute top-3 left-3 z-20 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm text-foreground">
                  {product.category?.name || `Category ${product.categoryId}`}
                </div>
                {/* Rating badge - top right */}
                {(() => {
                  const reviews = product.reviews || [];
                  const avg = reviews.length
                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                    : null;
                  return avg ? (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-[11px] font-bold leading-none text-foreground">{avg}</span>
                      <span className="text-[10px] text-muted-foreground leading-none">({reviews.length})</span>
                    </div>
                  ) : null;
                })()}
                {/* Stock badge - bottom right */}
                <div className={`absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm`}>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.stock > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
                  <span className={`text-[10px] font-semibold leading-none ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {product.stock > 0 ? `${product.stock} ${t('dona')}` : t("Sotuvda yo'q")}
                  </span>
                </div>
                <Link to={`/product/${product.id}`} className="absolute inset-0 z-10 flex items-center justify-center text-6xl font-black text-foreground/10 group-hover:scale-110 transition-transform duration-500">
                  {product.img_url ? (
                    <img src={product.img_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    product.name.charAt(0)
                  )}
                </Link>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col gap-1.5">
                {/* Product Name */}
                <Link to={`/product/${product.id}`} className="hover:underline">
                  <CardTitle className="line-clamp-1 text-lg font-bold text-foreground tracking-tight">{product.name}</CardTitle>
                </Link>

                {/* Price */}
                <div className="mt-auto pt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-extrabold text-foreground">
                    {formatPrice(product.price, t)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                <div className="w-full h-[76px] flex flex-col justify-end">
                  {(() => {
                    const cartItem = cartItems.find(item => item.product.id === product.id);
                    if (cartItem) {
                      return (
                        <div className="flex flex-col gap-2 w-full">
                          {/* Quantity UI */}
                          <div className="flex items-center p-1 bg-muted/50 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm w-full">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm disabled:opacity-50" 
                              onClick={() => updateQuantity(product.id, cartItem.quantity, -1)}
                              disabled={cartItem.quantity <= 1 || updateQuantityMutation.isPending}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="flex-1 text-center text-xs font-bold">{cartItem.quantity}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span tabIndex={0} className="inline-block">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-7 w-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm" 
                                    onClick={() => updateQuantity(product.id, cartItem.quantity, 1)}
                                    disabled={updateQuantityMutation.isPending || cartItem.quantity >= product.stock}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              {cartItem.quantity >= product.stock && (
                                <TooltipContent side="top">
                                  <p>{t("Sotuvda boshqa qolmadi")}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </div>
                          
                          {/* Action Buttons UI */}
                          <div className="flex items-center gap-2 w-full">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-10 shrink-0 text-destructive border-transparent hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors focus:ring-0 rounded-lg shadow-sm bg-muted/50"
                              onClick={() => removeItem(product.id)}
                              disabled={removeItemMutation.isPending}
                              title={t("Savatdan olib tashlash")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              className="flex-1 h-8 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold shadow-none transition-colors rounded-lg"
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
                        className="w-full h-10 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 mt-1" 
                        onClick={() => handleAddToCart(product)} 
                        disabled={product.stock === 0 || addToCartMutation.isPending}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock === 0 ? t('Sotuvda yo\'q') : t("Savatga qo'shish")}
                      </Button>
                    )
                  })()}
                </div>
              </CardFooter>
            </Card>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{t("Mahsulotlar topilmadi")}</h3>
              <p>{t("Qidiruv yoki filtrlarni o'zgartirib ko'ring.")}</p>
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
