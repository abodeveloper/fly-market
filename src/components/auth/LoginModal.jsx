import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';

export function LoginModal({ onSuccess, onSwitch }) {
  const { t } = useTranslation();
  const { login } = useAuthStore();

  const schema = yup.object({
    email: yup.string().email(t("Noto'g'ri email")).required(t("Email kiritish majburiy")),
    password: yup.string().required(t("Parolni kiritish majburiy")),
  }).required();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      login(data.user);
      toast.success(t("Tizimga muvaffaqiyatli kirdingiz"));
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      handleApiError(error, t("Kirishda xatolik"));
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="p-6 bg-background rounded-lg border shadow-lg space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t("Xush kelibsiz")}</h2>
        <p className="text-sm text-muted-foreground">{t("Kirish uchun ma'lumotlaringizni kiriting")}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input 
            placeholder={t("Email")} 
            {...register('email')} 
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Input 
            type="password" 
            placeholder={t("Parol")} 
            {...register('password')} 
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? t("Kirilmoqda...") : t("Kirish")}
        </Button>
      </form>
      <div className="text-center text-sm">
        {t("Hisobingiz yo'qmi?")}{' '}
        <span className="text-primary hover:underline cursor-pointer" onClick={onSwitch}>
          {t("Ro'yxatdan o'tish")}
        </span>
      </div>
    </div>
  );
}
