import { Link, useLocation } from "wouter";
import {
  AlertOctagon,
  Clock,
  Edit3,
  LayoutDashboard,
  LogOut,
  Plus,
  RotateCcw,
  User,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar({
  onNewTicket,
}: {
  onNewTicket: () => void;
}) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const isAdmin =
    user?.role === "ADMIN";

  const navItems = [
    {
      href: "/",
      label: "الرئيسية",
      icon: LayoutDashboard,
    },
    {
      href: "/complaints",
      label: "الشكاوي",
      icon: AlertOctagon,
    },
    {
      href: "/modifications",
      label: "تعديلات الطلبات",
      icon: Edit3,
    },
    {
      href: "/cancellations",
      label: "إلغاء الطلبات",
      icon: XCircle,
    },
    {
      href: "/returns",
      label: "الاستبدال والاسترجاع",
      icon: RotateCcw,
    },
    {
      href: "/delays",
      label: "الأخطاء والتأخير",
      icon: Clock,
    },
    ...(isAdmin
      ? [
          {
            href: "/users",
            label: "المستخدمون",
            icon: User,
          },
        ]
      : []),
  ];

  return (
    <aside
      className="
      sticky
      top-4
      m-4
      flex
      h-[calc(100vh-2rem)]
      w-80
      shrink-0
      flex-col
      rounded-[32px]
      border
      border-green-100
      bg-white/90
      backdrop-blur-xl
      shadow-[0_25px_70px_rgba(0,0,0,.06)]
    "
    >
      {/* Header */}
      <div className="border-b border-green-100 p-6">
        <div className="flex flex-col items-center">
          <div
            className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-[28px]
            bg-white
            shadow-[0_20px_50px_rgba(0,0,0,.08)]
          "
          >
            <img
              src="/logo/Aljouf_logo.png"
              alt="Aljouf"
              className="w-14 object-contain"
            />
          </div>

          <h2 className="mt-4 text-lg font-black">
            الجوف الزراعية
          </h2>

          <p className="text-sm text-muted-foreground">
            مركز خدمة العملاء
          </p>
        </div>

        <Button
          onClick={onNewTicket}
          className="
            mt-6
            h-12
            w-full
            rounded-2xl
            font-bold
          "
        >
          <Plus className="ml-2 h-4 w-4" />
          تذكرة جديدة
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive =
            location === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
            >
              <div
                className={cn(
                  `
                  flex
                  h-14
                  items-center
                  gap-4
                  rounded-2xl
                  px-4
                  font-semibold
                  transition-all
                  duration-200
                  cursor-pointer
                  `,
                  isActive
                    ? `
                      bg-green-50
                      text-primary
                      shadow-sm
                      border
                      border-green-100
                    `
                    : `
                      text-muted-foreground
                      hover:bg-green-50/70
                      hover:text-foreground
                    `
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive &&
                      "text-primary"
                  )}
                />

                <span>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-green-100 p-4">
        {/* <div
          className="
          mb-4
          flex
          items-center
          gap-3
          rounded-2xl
          bg-green-50/50
          p-3
        "
        >
          <div
            className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-primary/10
          "
          >
            <User className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {user?.username ??
                "مستخدم النظام"}
            </p>

            <p className="text-xs text-muted-foreground">
              {isAdmin
                ? "مدير النظام"
                : "موظف خدمة العملاء"}
            </p>
          </div>
        </div> */}

        <Button
          variant="ghost"
          onClick={logout}
          className="
            h-12
            w-full
            justify-start
            rounded-2xl
            text-muted-foreground
            hover:bg-red-50
            hover:text-destructive
          "
        >
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          الإصدار 1.0.0
        </p>
        
      </div>
      
    </aside>
  );
}