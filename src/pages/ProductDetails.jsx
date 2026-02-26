import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI, reviewAPI } from '@/services/api';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Imported Subcomponents
import { ProductImage } from '@/components/product/ProductImage';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductReviews } from '@/components/product/ProductReviews';

export function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id),
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewAPI.getProductReviews(id),
  });

  if (!isProductLoading && !product) {
    return <div className="container mx-auto p-4 text-center">{t("Mahsulot topilmadi")}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:py-8 space-y-12">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("Mahsulotlarga qaytish")}
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <ProductImage 
          product={product} 
          isLoading={isProductLoading} 
        />
        
        <div className="flex flex-col h-full">
          <ProductInfo 
            product={product} 
            reviews={reviews} 
            isLoading={isProductLoading || isReviewsLoading} 
          />
          
          {!isProductLoading && product && (
            <ProductActions product={product} />
          )}
        </div>
      </div>
      
      {!isProductLoading && product && (
        <ProductReviews productId={id} />
      )}
    </div>
  );
}
