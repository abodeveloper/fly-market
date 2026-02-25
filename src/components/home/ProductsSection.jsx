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
import { Minus, Plus, Trash2, ShoppingCart, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
        toast.error('Please login to add items to your cart.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: (data) => cartAPI.updateCartItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (data) => cartAPI.removeFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
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

        <div className="flex flex-col md:flex-row items-center gap-3 mb-12 bg-card p-2 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-border/60 max-w-5xl mx-auto">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t("Mahsulotlarni qidirish...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base"
          />
        </div>
        <div className="w-full md:w-[220px] border-t md:border-t-0 md:border-l border-border/60 pl-0 md:pl-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-11 border-0 shadow-none focus:ring-0 bg-transparent font-medium">
              <SelectValue placeholder={t("Barcha kategoriyalar")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("Barcha kategoriyalar")}</SelectItem>
              {!isLoadingCategories && categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-[200px] border-t md:border-t-0 md:border-l border-border/60 pl-0 md:pl-2">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-11 border-0 shadow-none focus:ring-0 bg-transparent font-medium">
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
                <div className="absolute top-3 left-3 z-20 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm text-foreground">
                  {product.category?.name || `Category ${product.categoryId}`}
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
                <Link to={`/product/${product.id}`} className="hover:underline">
                  <CardTitle className="line-clamp-1 text-lg font-bold text-foreground tracking-tight">{product.name}</CardTitle>
                </Link>
                <div className="mt-auto pt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-foreground">
                    {Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">{t("so'm")}</span>
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
                          <div className="flex items-center justify-between w-full h-8 border rounded-lg overflow-hidden bg-background shadow-sm">
                            <Button 
                              variant="ghost" 
                              className="h-full rounded-none px-3 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50" 
                              onClick={() => updateQuantity(product.id, cartItem.quantity, -1)}
                              disabled={cartItem.quantity <= 1 || updateQuantityMutation.isPending}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="flex-1 text-center text-sm font-bold">{cartItem.quantity}</span>
                            <Button 
                              variant="ghost" 
                              className="h-full rounded-none px-3 text-muted-foreground hover:text-foreground hover:bg-muted" 
                              onClick={() => updateQuantity(product.id, cartItem.quantity, 1)}
                              disabled={updateQuantityMutation.isPending}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Action Buttons UI */}
                          <div className="flex items-center gap-2 w-full">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-10 shrink-0 text-destructive border-transparent hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors focus:ring-0 rounded-lg shadow-sm bg-card"
                              onClick={() => removeItem(product.id)}
                              disabled={removeItemMutation.isPending}
                              title={t("Savatdan olib tashlash")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              className="flex-1 h-8 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold shadow-none transition-colors rounded-lg"
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
