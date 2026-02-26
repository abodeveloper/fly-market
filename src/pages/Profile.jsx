import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/useAuthStore';
import { authAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, MessageSquare, User, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Profile() {
  const { t } = useTranslation();
  const { user: cachedUser } = useAuthStore();

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['auth-status'],
    queryFn: authAPI.status,
  });

  const userData = statusData?.user || cachedUser;
  const initials = userData?.name
    ? userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : null;

  return (
    <div className="container mx-auto p-4 md:py-8 max-w-3xl space-y-4">

      {/* Profile strip */}
      <div className="flex items-center gap-3 py-3">
        {isLoading ? (
          <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
        ) : (
          <Avatar className="h-14 w-14 rounded-xl border border-border shrink-0">
            <AvatarImage />
            <AvatarFallback className="rounded-xl text-base font-bold bg-primary/10 text-primary">
              {initials || <User className="h-5 w-5 text-primary/60" />}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="min-w-0">
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-36 mb-1" />
              <Skeleton className="h-3.5 w-28" />
            </>
          ) : (
            <>
              <p className="text-base font-bold truncate">{userData?.name || t('Foydalanuvchi')}</p>
              <p className="text-sm text-muted-foreground truncate">{userData?.email}</p>
              {userData?.roles && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider rounded-full">
                  {userData.roles}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 pb-8">
        {[
          {
            to: '/orders',
            icon: Package,
            label: t('Buyurtmalarim'),
            desc: t('Sizning xaridlaringiz tarixi va buyurtmalar holati.'),
            iconBg: 'bg-blue-100/70 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
          },
          {
            to: '/reviews',
            icon: MessageSquare,
            label: t('Sharhlarim'),
            desc: t('Mahsulotlarga yozgan fikr va mulohazalaringiz.'),
            iconBg: 'bg-violet-100/70 dark:bg-violet-900/30',
            iconColor: 'text-violet-600 dark:text-violet-400',
          },
        ].map(({ to, icon: Icon, label, desc, iconBg, iconColor }) => (
          <Link key={to} to={to} className="group">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200">
              <div className={`p-2.5 ${iconBg} rounded-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base">{label}</p>
                <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
