import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/useAuthStore';
import { authAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, MessageSquare, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Profile() {
  const { t } = useTranslation();
  const { user: cachedUser } = useAuthStore();

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['auth-status'],
    queryFn: authAPI.status,
  });

  const userData = statusData?.user || cachedUser;

  return (
    <div className="container mx-auto p-4 md:py-8 space-y-6">
      <Card className="border-none shadow-none bg-muted/30">
        <CardContent className="p-4 flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-16 w-16 rounded-full" />
          ) : (
             <Avatar className="h-16 w-16 border-2 border-background shadow-xs">
              <AvatarFallback className="text-xl bg-primary/10">
                <User className="h-8 w-8 text-primary/70" />
              </AvatarFallback>
            </Avatar>
          )}
          <div className="text-left">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">{userData?.name || t('Foydalanuvchi')}</h1>
                <p className="text-sm text-muted-foreground mb-1.5">{userData?.email}</p>
                {userData?.roles && (
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider rounded">
                    {userData.roles}
                  </span>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mt-8 pb-8">
        <Link to="/orders" className="group">
          <Card className="h-full hover:border-primary/50 hover:shadow-sm transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full group-hover:scale-105 transition-transform duration-300">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t('Buyurtmalarim')}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{t('Sizning xaridlaringiz tarixi va buyurtmalar holati.')}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/reviews" className="group">
          <Card className="h-full hover:border-primary/50 hover:shadow-sm transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full group-hover:scale-105 transition-transform duration-300">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t('Sharhlarim')}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{t('Mahsulotlarga yozgan fikr va mulohazalaringiz.')}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
