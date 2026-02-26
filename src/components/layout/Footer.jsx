import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  const { t } = useTranslation();
  const scrollToSection = (e, id) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full border-t bg-card mt-auto text-card-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Logo onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-fit" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("Yangi avlod bozori. Sifat, ishonch va hamyonbop narxlar. O'zingiz qidirgan barcha mahsulotlarni bizning platformamizdan toping.")}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">{t("Tezkor havolalar")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li><a href="/#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> {t("Asosiy")}</a></li>
              <li><a href="/#products" onClick={(e) => scrollToSection(e, 'products')} className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> {t("Mahsulotlar")}</a></li>
              <li><a href="/#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> {t("Biz haqimizda")}</a></li>
              <li><a href="/#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> {t("Ko'p beriladigan savollar")}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">{t("Ijtimoiy tarmoqlar")}</h4>
            <div className="flex gap-4 mb-6">
              <a href={siteConfig.socials.telegram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors shadow-sm">
                <Send className="h-4 w-4 -ml-1 mt-0.5" />
              </a>
              <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors shadow-sm">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors shadow-sm">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors shadow-sm">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">{t("Bog'lanish")}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t(siteConfig.contact.address)}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary transition-colors">{siteConfig.contact.email}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
          <p>&copy; {new Date().getFullYear()} FlyMarket. {t("Barcha huquqlar himoyalangan.")}</p>
          <div className="flex gap-6">
            <a href="/#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-primary transition-colors">{t("Bosh sahifa")}</a>
            <a href="/#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-primary transition-colors">{t("Yordam")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
