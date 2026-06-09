import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAuth } from "@/App";
import {
  getGetStatsByCategoryQueryKey,
  getGetStatsQueryKey,
  getGetStatsTrendQueryKey,
  getListTicketsQueryKey,
  useGetStats,
  useGetStatsByCategory,
  useGetStatsTrend,
  useListTickets,
  useUsers,
} from "@/api/client";
import { AppLayout } from "@/components/layout/app-layout";
import { TicketTable } from "@/components/tickets/ticket-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryLabel } from "@/helpers/getStatus";

const STATS_COLORS = {
  COMPLAINT: "#ef4444",
  ORDER_MODIFICATION: "#06b6d4",
  ORDER_CANCELLATION: "#f59e0b",
  RETURN_REPLACEMENT: "#8b5cf6",
  ORDER_DELAY_ERROR: "#22c55e",
};
export function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { data: users = [], isLoading: usersLoading } = useUsers();

  const { data: stats, isLoading: statsLoading } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() },
  });

  const { data: trend, isLoading: trendLoading } = useGetStatsTrend({
    query: { queryKey: getGetStatsTrendQueryKey() },
  });

  const { data: categories, isLoading: categoriesLoading } = useGetStatsByCategory({
    query: { queryKey: getGetStatsByCategoryQueryKey() },
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useListTickets(
    { limit: 5 },
    { query: { queryKey: getListTicketsQueryKey() } }
  );

  const chartData =
  categories?.map((item) => ({
    ...item,
    label: getCategoryLabel(
      item.category
    ),
  })) ?? [];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-8">
<section
  className="
  relative
  overflow-hidden
  rounded-[36px]
  border
  border-green-100
  bg-gradient-to-br
  from-white
  via-white
  to-green-50/80
  shadow-[0_20px_60px_rgba(0,0,0,.05)]
"
>
  {/* Background Effects */}
  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

  <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-green-200/20 blur-3xl" />

  <div className="relative p-8 lg:p-10">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div
          className="
          mb-5
          inline-flex
          rounded-full
          bg-primary/10
          px-4
          py-2
          text-xs
          font-bold
          text-primary
        "
        >
          لوحة التحكم
        </div>

        <h1
          className="
          text-4xl
          font-black
          tracking-tight
          lg:text-5xl
        "
        >
          متابعة أداء خدمة العملاء
        </h1>

        <p
          className="
          mt-4
          max-w-3xl
          text-base
          leading-8
          text-muted-foreground
        "
        >
          نظرة تشغيلية شاملة على حجم التذاكر،
          مسار المعالجة، وتوزيع الطلبات حسب
          التصنيف والحالة.
        </p>
      </div>
    </div>
  </div>
</section>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="إجمالي التذاكر"
            value={stats?.total}
            loading={statsLoading}
            icon={<Activity className="h-5 w-5" />}
            tone="primary"
          />
          <StatCard
            title="تذاكر جديدة"
            value={stats?.new}
            loading={statsLoading}
            icon={<AlertOctagon className="h-5 w-5" />}
            tone="info"
          />
          <StatCard
            title="قيد المعالجة"
            value={stats?.inProgress}
            loading={statsLoading}
            icon={<Clock className="h-5 w-5" />}
            tone="warning"
          />
          <StatCard
            title="تذاكر محلولة"
            value={stats?.resolved}
            loading={statsLoading}
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="success"
          />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
         <div
  className="
    overflow-hidden
    rounded-[36px]
    border
    border-green-100
    bg-white
    shadow-[0_20px_60px_rgba(0,0,0,.04)]
    xl:col-span-2
  "
>
          <div
  className="
    flex
    items-center
    justify-between
    border-b
    border-green-100
    bg-gradient-to-l
    from-[#f3faf5]
    via-white
    to-white
    px-8
    py-6
  "
>
              <div>
                <CardTitle className="text-base font-bold">تدفق التذاكر</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">آخر 7 أيام</p>
              </div>
              <div className="flex h-9 items-center gap-2 rounded-lg bg-primary/10 px-3 text-xs font-bold text-primary">
                <TrendingUp className="h-4 w-4" />
                تحديث مباشر
              </div>
            </div>
            <CardContent className="p-5">
              <div className="h-[320px] w-full">
                {trendLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trend}
                      margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="ticketCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="hsl(var(--border))"
                        strokeDasharray="4 4"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 12px 28px hsl(150 30% 12% / 0.12)",
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        name="عدد التذاكر"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.5}
                        fill="url(#ticketCount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </div>

      <div
  className="
    overflow-hidden
    rounded-[36px]
    border
    border-green-100
    bg-white
    shadow-[0_20px_60px_rgba(0,0,0,.04)]
  "
>
            <div
  className="
    border-b
    border-green-100
    bg-gradient-to-l
    from-[#f3faf5]
    via-white
    to-white
    px-8
    py-6
  "
>
              <CardTitle className="text-base font-bold">توزيع التذاكر</CardTitle>
              <p className="text-sm text-muted-foreground">حسب نوع الطلب</p>
            </div>
            <CardContent className="p-5">
              <div className="h-[238px] w-full">
                {categoriesLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                 <Pie
  data={chartData}
  cx="50%"
  cy="50%"
  innerRadius={65}
  outerRadius={100}
  paddingAngle={5}
  cornerRadius={10}
  dataKey="count"
  nameKey="label"
  stroke="#ffffff"
  strokeWidth={4}
  
>
                   {chartData.map((entry, index) => (
  <Cell
    key={`cell-${index}`}
    fill={
      STATS_COLORS[
        entry.category as keyof typeof STATS_COLORS
      ] || "hsl(var(--primary))"
    }
  />
))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {categoriesLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-5 w-full" />
                    ))
                  : chartData?.map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                STATS_COLORS[item.category as keyof typeof STATS_COLORS] ||
                                "hsl(var(--primary))",
                            }}
                          />
                         <span className="truncate text-muted-foreground">
  {getCategoryLabel(item.category)}
</span>
                        </div>
                        <span className="font-bold">{item.count}</span>
                      </div>
                    ))}
              </div>
            </CardContent>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold">أحدث التذاكر</h2>
              <p className="text-sm text-muted-foreground">آخر العمليات التي تحتاج متابعة</p>
            </div>
          </div>
          <TicketTable tickets={ticketsData?.tickets || []} isLoading={ticketsLoading} />
        </section>

{isAdmin && (
  <div
    className="
      overflow-hidden
      rounded-[36px]
      border
      border-green-100
      bg-white
      shadow-[0_24px_80px_rgba(0,0,0,.05)]
    "
  >
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-green-100
        bg-gradient-to-l
        from-[#f3faf5]
        via-white
        to-white
        px-8
        py-6
      "
    >
      <div>
        <h2 className="text-xl font-black">
          المستخدمون
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة الحسابات النشطة داخل النظام
        </p>
      </div>

      <div
        className="
          flex
          items-center
          gap-2
          rounded-2xl
          border
          border-green-100
          bg-white
          px-4
          py-2
          shadow-sm
        "
      >
        <Users className="h-4 w-4 text-primary" />

        <span className="font-bold">
          {users.length}
        </span>
      </div>
    </div>

<div className="p-6">
  {usersLoading ? (
    <Skeleton className="h-56 w-full rounded-3xl" />
  ) : (
    <div
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-green-100
        bg-white
      "
    >
      <Table>
        <TableHeader className="bg-gradient-to-l from-[#f3faf5] via-white to-white">
          <TableRow>
            <TableHead className="h-16 text-right font-black text-primary">
              المستخدم
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              الصلاحية
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              تاريخ الإنشاء
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              المعرف
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u) => (
            <TableRow
              key={u.id}
              className="
                border-b
                border-green-50
                transition-all
                hover:bg-[#f8fcf9]
              "
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary/10
                      font-black
                      text-primary
                    "
                  >
                    {u.username
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <div className="font-bold">
                      {u.username}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      حساب نظام
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                {u.role === "ADMIN" ? (
                  <span
                    className="
                      inline-flex
                      rounded-full
                      bg-blue-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-blue-700
                    "
                  >
                    مدير النظام
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex
                      rounded-full
                      bg-green-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-green-700
                    "
                  >
                    مستخدم
                  </span>
                )}
              </TableCell>

              <TableCell>
                <div
                  className="
                    inline-flex
                    rounded-2xl
                    bg-[#f8fcf9]
                    px-4
                    py-2
                    text-sm
                    font-medium
                  "
                >
                  {new Date(
                    u.createdAt
                  ).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </TableCell>

              <TableCell>
                <div
                  className="
                    inline-flex
                    rounded-full
                    border
                    border-green-100
                    bg-white
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-primary
                  "
                >
                  #{u.id}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )}
</div>
  </div>
)}
      </div>
    </AppLayout>
  );
}

function SummaryChip({ label, value }: { label: string; value: number }) {
  return (
   <div
  className="
    rounded-3xl
    border
    border-green-100
    bg-white
    px-5
    py-4
    shadow-sm
  "
>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
    <p className="mt-2 text-3xl font-black">{value.toLocaleString("en-US")}</p>
    </div>
  );
}

function StatCard({
  title,
  value,
  loading,
  icon,
  tone,
}: {
  title: string;
  value?: number;
  loading: boolean;
  icon: ReactNode;
  tone: "primary" | "info" | "warning" | "success";
}) {
  const toneClass = {
    primary:
      "bg-primary/10 text-primary",
    info:
      "bg-cyan-50 text-cyan-700",
    warning:
      "bg-amber-50 text-amber-700",
    success:
      "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-green-100
        bg-white
        shadow-[0_12px_40px_rgba(0,0,0,.04)]
        transition-all
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(0,0,0,.08)]
      "
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-muted-foreground">
              {title}
            </p>

            {loading ? (
              <Skeleton className="mt-4 h-9 w-28" />
            ) : (
              <h3 className="mt-3 text-4xl font-black">
                {(value ?? 0).toLocaleString()}
              </h3>
            )}
          </div>

          <div
            className={`
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              ${toneClass}
            `}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}