import { useTranslation } from 'react-i18next';

export function AboutSection() {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-20 border-t scroll-mt-16">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-4">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">{t("Biz haqimizda")}</h2>
          <div className="h-1.5 w-20 bg-primary rounded-full"></div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("FlyMarket - bu eng sifatli mahsulotlarni sizning ostonangizgacha yetkazib beruvchi zamonaviy onlayn do'kon. Bizning asosiy maqsadimiz mijozlarimizga hamyonbop narxlarda yuqori sifatli tovarlarni taqdim etish va ularning vaqtini tejashdir.")}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("Biz faqat ishonchli yetkazib beruvchilar bilan ishlaymiz va xaridlaringiz xavfsizligini 100% kafolatlaymiz.")}
          </p>
          <ul className="space-y-3 mt-6">
            {[
              t("10 000+ xursand mijozlar"),
              t("Tezkor yetkazib berish xizmati"),
              t("24/7 mijozlarni qo'llab-quvvatlash")
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-none bg-primary/5 border-none flex flex-col items-center justify-center p-8">
          <img 
            src="https://illustrations.popsy.co/amber/success.svg" 
            alt="FlyMarket Cartoon 3D Illustration" 
            className="w-full h-full object-contain p-4 drop-shadow-xl"
          />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-background/80 backdrop-blur-md border p-6 rounded-2xl text-foreground text-center shadow-lg">
              <p className="font-bold text-xl">{t("Sifat va Ishonch")}</p>
              <p className="text-muted-foreground mt-1 text-sm">{t("2020-yildan beri xizmatingizdamiz")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
