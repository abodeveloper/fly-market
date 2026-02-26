import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

export function ProductImage({ product, isLoading }) {
  if (isLoading) {
    return <Skeleton className="aspect-square w-full rounded-2xl" />;
  }

  return (
    <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center relative overflow-hidden text-9xl font-bold text-primary/20">
      {product?.img_url ? (
        <img 
          src={product.img_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground/30">
          <Package className="w-24 h-24 mb-4" />
          <span className="text-xl font-medium tracking-widest uppercase">{product?.name?.substring(0, 3)}</span>
        </div>
      )}
    </div>
  );
}
