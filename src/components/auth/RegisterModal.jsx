import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function RegisterModal({ onSuccess, onSwitch }) {
  const { t } = useTranslation();

  const schema = yup.object({
    name: yup.string().required(t("Ism kiritish majburiy")),
    email: yup.string().email(t("Noto'g'ri email")).required(t("Email kiritish majburiy")),
    password: yup.string().min(6, t("Parol kamida 6 ta belgidan iborat bo'lishi kerak")).required(t("Parolni kiritish majburiy")),
  }).required();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success(t("Muvaffaqiyatli ro'yxatdan o'tdingiz. Endi tizimga kirishingiz mumkin."));
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t("Ro'yxatdan o'tishda xatolik"));
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="p-6 bg-background rounded-lg border shadow-lg space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t("Hisob yaratish")}</h2>
        <p className="text-sm text-muted-foreground">{t("Ro'yxatdan o'tish uchun ma'lumotlaringizni kiriting")}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input 
            placeholder={t("To'liq ism")}
            {...register('name')} 
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
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
        <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? t("Ro'yxatdan o'tilmoqda...") : t("Ro'yxatdan o'tish")}
        </Button>
      </form>
      <div className="text-center text-sm">
        {t("Allaqachon hisobingiz bormi?")}{' '}
        <span className="text-primary hover:underline cursor-pointer" onClick={onSwitch}>
          {t("Kirish")}
        </span>
      </div>
    </div>
  );
}
