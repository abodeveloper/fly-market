import { useTranslation } from 'react-i18next';

export function FaqSection() {
  const { t } = useTranslation();
  const faqs = [
    {
      q: t("Buyurtma necha kunda yetkazib beriladi?"),
      a: t("Buyurtmalar odatda tasdiqlanganidan so'ng 1-3 ish kuni ichida manzilga yetkazib beriladi. Viloyatlar bo'ylab yetkazib berish muddati 2-5 kungacha cho'zilishi mumkin.")
    },
    {
      q: t("To'lovni qanday amalga oshirishim mumkin?"),
      a: t("Biz Click, Payme ilovalari orqali onlayn to'lovlarni hamda naqd pul ko'rinishida yetkazib berilganda to'lashni qabul qilamiz.")
    },
    {
      q: t("Mahsulotni qaytarish yo'riqnomasi qanday?"),
      a: t("Xarid qilingan mahsulot o'z sifatini va qadog'ini yo'qotmagan holatda 10 kun ichida qaytarilishi yoki almashtirilishi mumkin.")
    },
    {
      q: t("Xarid uchun ro'yxatdan o'tish majburiymi?"),
      a: t("Ha, mahsulotlarni harid qilish, sharh yozish va buyurtmalar tarixini kuzatib borish uchun ro'yxatdan o'tishingiz talab etiladi.")
    }
  ];

  return (
    <section id="faq" className="w-full py-20 border-t bg-muted/30 scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">{t("Ko'p so'raladigan savollar")}</h2>
          <p className="text-lg text-muted-foreground">{t("O'zingizni qiziqtirgan barcha savollarga javob toping.")}</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-border bg-card rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground outline-none">
                {faq.q}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" w="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-4 leading-relaxed animate-in fade-in duration-300">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
