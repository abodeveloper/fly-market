import { siteConfig } from '@/config/site';

const { symbol, locale, position } = siteConfig.currency;

/**
 * Narxni formatlash
 * @param {number} amount - Narx
 * @param {function} t - react-i18next tarjimon (ixtiyoriy)
 *
 * Misol: formatPrice(15000, t) => "15 000 so'm" yoki "$15,000"
 */
export function formatPrice(amount, t) {
  const num = Number(amount || 0);
  const formatted = num.toLocaleString(locale);
  const sym = t ? t(symbol) : symbol;
  return position === 'before'
    ? `${sym}${formatted}`
    : `${formatted} ${sym}`;
}
