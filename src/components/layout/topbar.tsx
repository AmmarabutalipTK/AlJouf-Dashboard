import {
  RefreshCcw,
  ShieldCheck,
  BookOpen,
  User,
} from "lucide-react";


import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/App";
import {
  getHealthCheckQueryKey,
  useHealthCheck,
} from "@/api/client";

import { Button } from "@/components/ui/button";

export function Topbar() {
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { data: health } =
    useHealthCheck({
      query: {
        queryKey:
          getHealthCheckQueryKey(),
        refetchInterval: 30000,
      },
    });

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
<header
  className="
  sticky
  top-4
  z-20
  mb-6
  mx-auto
  flex
  h-20
  w-[95%]
  items-center
  justify-between
  rounded-[28px]
  border
  border-green-100
  bg-white/90
  px-6
  backdrop-blur-xl
  shadow-[0_20px_60px_rgba(0,0,0,.05)]
"
>
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <div
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-green-50
          px-4
          py-3
        "
        >
          <div
            className={`
              h-3
              w-3
              rounded-full
              ${
                health
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }
            `}
          />

          <div>
            <p className="text-xs font-bold text-primary">
              حالة النظام
            </p>

            <p className="text-xs text-muted-foreground">
              {health
                ? "جميع الخدمات تعمل"
                : "جاري التحقق"}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col">
          <span className="text-xs font-semibold text-primary">
            منصة الجوف الرقمية
          </span>

          <span className="text-sm text-muted-foreground">
            إدارة خدمة العملاء
          </span>
        </div>
      </div>

      {/* Right Side */}
{/* Right Side */}
<div className="flex items-center gap-3">
  <Button
    variant="outline"
    onClick={handleRefresh}
    className="
      h-12
      rounded-2xl
      border-green-100
      bg-white
      px-4
    "
  >
    <RefreshCcw className="ml-2 h-4 w-4" />
    تحديث
  </Button>

  <Button
    asChild
    variant="outline"
    className="
      h-12
      rounded-2xl
      border-green-100
      bg-white
      px-4
    "
  >
    <a
      href="https://aljouf-manual.takarubdev.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <BookOpen className="ml-2 h-4 w-4" />
      دليل الجوف
    </a>
  </Button>

  <div
    className="
      flex
      items-center
      gap-3
      rounded-2xl
      border
      border-green-100
      bg-white
      px-4
      py-2
    "
  >
    <div
      className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        bg-primary/10
      "
    >
      {user?.role === "ADMIN" ? (
        <ShieldCheck className="h-5 w-5 text-primary" />
      ) : (
        <User className="h-5 w-5 text-primary" />
      )}
    </div>

    <div className="text-right">
      <p className="font-bold">
        {user?.username ?? "مدير النظام"}
      </p>

      <p className="text-xs text-muted-foreground">
        {user?.role === "ADMIN"
          ? "مدير النظام"
          : "موظف خدمة العملاء"}
      </p>
    </div>
  </div>
</div>
      {/* Decorative Glow */}
      <div
        className="
        pointer-events-none
        absolute
        left-1/2
        top-0
        h-24
        w-24
        -translate-x-1/2
        rounded-full
        bg-primary/10
        blur-3xl
      "
      />
    </header>
  );
}