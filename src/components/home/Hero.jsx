import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 pt-4 md:pt-8 mb-16">
      <section id="home" className="relative rounded-3xl overflow-hidden bg-card border border-border/50 min-h-[500px] flex items-center p-8 md:p-12 lg:p-16 scroll-mt-24 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left Text Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary backdrop-blur-md text-sm font-bold tracking-widest uppercase mb-4">
              {t('Yangi Avlod Bozori')}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-foreground drop-shadow-sm">
              {t('Eng yaxshi xaridlar')} <br/><span className="text-primary">{t('bir joyda.')}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              {t("Sifat, ishonch va hamyonbop narxlar. O'zingiz qidirgan barcha mahsulotlarni bizning platformamizdan toping va uyingizgacha yetkazib beramiz.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                {t('Xaridni boshlash')}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-xl bg-background/50 backdrop-blur-sm" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                {t('Biz haqimizda')}
              </Button>
            </div>
          </div>

          {/* Right Image/Illustration Content */}
          <div className="relative hidden md:flex items-center justify-center">
            {/* Decorative background blur blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-3xl rounded-full -z-10"></div>
            
            <img 
              src="https://illustrations.popsy.co/amber/online-shopping.svg" 
              alt="FlyMarket Shopping Experience" 
              className="w-full max-w-[500px] h-[500px] object-contain p-4 drop-shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
            
            {/* Floating badges */}
            <div className="absolute top-10 -left-6 bg-background rounded-2xl p-4 shadow-xl border border-border/50 animate-[bounce_4s_infinite]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-xl">🛍️</div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">{t('Maxsus')}</p>
                  <p className="text-sm font-bold">{t('Chegirmalar')}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-10 -right-6 bg-background rounded-2xl p-4 shadow-xl border border-border/50 animate-[bounce_5s_infinite_reverse]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center text-xl">🚀</div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">{t('Tezkor')}</p>
                  <p className="text-sm font-bold">{t('Yetkazib berish')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
