import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '@/config/site';

export function ContactSection() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      toast.error(t("Telegram bot API token yoki Chat ID topilmadi. Iltimos .env faylni tekshiring."));
      setIsSubmitting(false);
      return;
    }

    const text = `🎯 <b>Yangi xabar! (FlyMarket)</b>\n\n👤 <b>Ism:</b> ${name}\n📞 <b>Aloqa:</b> ${contactInfo}\n💬 <b>Xabar:</b> ${message}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      if (response.ok) {
        toast.success(t("Xabaringiz yuborildi. Rahmat!"));
        setName('');
        setContactInfo('');
        setMessage('');
      } else {
        toast.error(t("Xatolik yuz berdi. Iltimos keyinroq urinib ko'ring."));
      }
    } catch (error) {
      toast.error(t("Tarmoq xatosi. Iltimos internetingizni tekshirib qayta urinib ko'ring."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 border-t scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">{t("Biz bilan bog'laning")}</h2>
            <p className="text-lg text-muted-foreground">{t("Taklif va shikoyatlaringiz bormi? Yoki yordam kerakmi? Bizga yozing, tez orada siz bilan bog'lanamiz.")}</p>
          </div>
          
          <div className="space-y-6">
            {[
              { icon: "📍", title: t("Manzil"), subtitle: t(siteConfig.contact.address) },
              { icon: "📞", title: t("Telefon"), subtitle: siteConfig.contact.phone },
              { icon: "✉️", title: t("Email"), subtitle: siteConfig.contact.email }
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">{info.icon}</div>
                <div>
                  <p className="font-bold text-foreground">{info.title}</p>
                  <p className="text-muted-foreground">{info.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card border border-border p-8 rounded-3xl shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Ismingiz")}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="flex h-12 w-full mx-0 rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" placeholder={t("Ali Valiyev")} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Telefon / Email")}</label>
              <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required className="flex h-12 w-full mx-0 rounded-xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" placeholder={siteConfig.contact.phone} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Xabaringiz")}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required className="flex min-h-[120px] w-full mx-0 rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-y disabled:cursor-not-allowed disabled:opacity-50" placeholder={t("Xabaringizni bu yerga yozing...")} disabled={isSubmitting}></textarea>
            </div>
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90">
              {isSubmitting ? t("Yuborilmoqda...") : t("Xabarni yuborish")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
