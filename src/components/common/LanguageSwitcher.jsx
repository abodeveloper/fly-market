import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getLanguageLabel = () => {
    switch (i18n.language) {
      case 'en': return 'EN';
      case 'ru': return 'RU';
      case 'uz':
      default: return 'UZ';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 relative">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-semibold">{getLanguageLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('uz')}>
          🇺🇿 O'zbekcha
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ru')}>
          🇷🇺 Русский
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
