import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProductInfo({ product, reviews, isLoading }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const averageRating = reviews?.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
            {product?.category?.name || t('Kategoriya')}
          </span>
          <div className="flex items-center gap-1.5 bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-2 py-0.5 rounded-full">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-bold leading-none">{averageRating}</span>
            <span className="text-[10px] text-muted-foreground ml-1 leading-none">({reviews?.length || 0})</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.1]">
          {product?.name}
        </h1>
        
        <div className="flex items-baseline gap-2 text-primary">
          <span className="text-4xl font-black tracking-tighter">
            {Number(product?.price).toLocaleString('uz-UZ')}
          </span>
          <span className="text-lg font-bold text-muted-foreground uppercase">{t("so'm")}</span>
        </div>
      </div>

      <div className="flex-1 w-full bg-muted/40 rounded-xl p-4 md:p-5 mb-8 border border-border/50">
        <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
          {t("Mahsulot haqida")}
        </h3>
        <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
          {product?.description || t('Tavsif mavjud emas.')}
        </p>
      </div>

      <div className="space-y-4 mt-auto">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
          <span className="text-sm font-semibold text-muted-foreground">{t("Sotuvchida mavjud:")}</span>
          <span className="font-bold text-foreground flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product?.stock > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-destructive'}`} />
            {product?.stock > 0 ? `${product.stock} ${t('dona')}` : t("Sotuvda yo'q")}
          </span>
        </div>
      </div>
    </div>
  );
}
