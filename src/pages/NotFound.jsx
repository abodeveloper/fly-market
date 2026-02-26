import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
      {/* Big 404 */}
      <div className="relative select-none">
        <p className="text-[120px] sm:text-[180px] font-black leading-none text-muted/30 dark:text-muted/20">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Home className="h-10 w-10 text-primary/60" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2 -mt-4">
        <h1 className="text-2xl font-black tracking-tight">{t("Sahifa topilmadi")}</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {t("Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.")}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-xl gap-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
          {t("Orqaga")}
        </Button>
        <Button className="rounded-xl gap-2" asChild>
          <Link to="/">
            <Home className="h-4 w-4" />
            {t("Bosh sahifa")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
