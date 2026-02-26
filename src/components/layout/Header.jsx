import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, Home, Package, Info, HelpCircle, PhoneCall, Settings, ShoppingBag, LogOut } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { cartAPI } from '@/services/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { Logo } from '@/components/common/Logo';

export function Header() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout, authModal, setAuthModal } = useAuthStore();
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    enabled: isAuthenticated,
  });
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    const handleScroll = () => {
      const sections = ['home', 'products', 'about', 'contact', 'faq'];
      const scrollPosition = window.scrollY + 200; // offset

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const cartItems = cartData?.cartItems || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-2 md:gap-0">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menyu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col border-r-0 bg-background/95 backdrop-blur-xl">
              <SheetTitle className="sr-only">{t('Navigatsiya menyusi')}</SheetTitle>
              
              <div className="p-6 pb-2">
                 <Logo onClick={() => setIsMobileMenuOpen(false)} className="w-fit mb-4" />
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
                {[
                  { id: 'home', label: t('Bosh sahifa'), icon: Home },
                  { id: 'products', label: t('Mahsulotlar'), icon: Package },
                  { id: 'about', label: t('Biz haqimizda'), icon: Info },
                  { id: 'faq', label: t('FAQ'), icon: HelpCircle },
                  { id: 'contact', label: t('Aloqa'), icon: PhoneCall }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                  <a 
                    key={item.id}
                    href={`/#${item.id}`}
                    onClick={(e) => { 
                      setIsMobileMenuOpen(false);
                      if (window.location.pathname === '/') { 
                        // Kichik kechikish bilan native anchor urilishi uchun
                        setTimeout(() => {
                           const el = document.getElementById(item.id);
                           if(el) {
                             const y = el.getBoundingClientRect().top + window.scrollY - 80;
                             window.scrollTo({ top: y, behavior: 'smooth' });
                           }
                        }, 400);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 ${
                      activeSection === item.id 
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]' 
                        : 'bg-transparent text-foreground hover:bg-muted hover:scale-[1.01]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                )})}
                {isAuthenticated && (
                  <Link 
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 bg-transparent text-foreground hover:bg-muted hover:scale-[1.01]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {t('Buyurtmalarim')}
                  </Link>
                )}
              </div>
              
              <div className="px-4 mb-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-secondary/50 hover:bg-secondary text-foreground font-bold transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center -ml-1 text-primary">
                        <User className="h-4 w-4 text-primary/70" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm leading-none mb-1">{user?.name}</span>
                        <span className="text-[10px] text-muted-foreground leading-none font-normal">{user?.email}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); logout(); }} 
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold transition-all duration-300 text-left w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      {t('Tizimdan chiqish')}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setIsMobileMenuOpen(false); setAuthModal('login'); }} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-all duration-300 text-left">
                    <User className="w-5 h-5" />
                    {t('Kirish')} / {t("Ro'yxatdan o'tish")}
                  </button>
                )}
              </div>

              <div className="p-4 mx-4 mb-6 bg-card border border-border/50 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('Sozlamalar')}</span>
                </div>
                <div className="flex items-center justify-between bg-muted/50 p-1.5 rounded-2xl">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo className="pl-1 md:pl-0" />
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-4 lg:gap-8 px-4 h-full overflow-hidden">
          {[
            { id: 'home', label: t('Bosh sahifa') },
            { id: 'products', label: t('Mahsulotlar') },
            { id: 'about', label: t('Biz haqimizda') },
            { id: 'faq', label: t('FAQ') },
            { id: 'contact', label: t('Aloqa') }
          ].map((item) => (
            <a 
              key={item.id}
              href={`/#${item.id}`}
              onClick={(e) => { 
                if (window.location.pathname === '/') { 
                  e.preventDefault(); 
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); 
                }
              }}
              className={`relative flex items-center h-full text-sm font-medium transition-colors hover:text-primary ${
                activeSection === item.id 
                  ? 'text-primary after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[3px] after:bg-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side*/}
        <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-4 border-r pr-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-1.5 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 bg-primary/10 transition-colors hover:bg-primary/20">
                      <AvatarFallback className="bg-transparent">
                        <User className="h-5 w-5 text-primary/70" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full text-foreground hover:bg-muted">{t('Profil')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer w-full text-foreground hover:bg-muted">{t('Buyurtmalarim')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/reviews" className="cursor-pointer w-full text-foreground hover:bg-muted">{t('Sharhlarim')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10">
                    {t('Tizimdan chiqish')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAuthModal('login')}>{t('Kirish')}</Button>
              <Button size="sm" onClick={() => setAuthModal('register')}>{t("Ro'yxatdan o'tish")}</Button>
              
              <Dialog open={!!authModal} onOpenChange={(open) => !open && setAuthModal(null)}>
                <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none" aria-describedby={undefined}>
                  {authModal === 'login' && <LoginModal onSuccess={() => setAuthModal(null)} onSwitch={() => setAuthModal('register')} />}
                  {authModal === 'register' && <RegisterModal onSuccess={() => setAuthModal('login')} onSwitch={() => setAuthModal('login')} />}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
