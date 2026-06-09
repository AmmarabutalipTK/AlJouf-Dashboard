import { useState } from "react";

import { AppLayout } from "@/components/layout/app-layout";
import { TicketTable } from "@/components/tickets/ticket-table";

import {
  useListTickets,
  ListTicketsCategory,
  ListTicketsStatus,
} from "@/api/client";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Filter, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface TicketsPageProps {
  category?: ListTicketsCategory;
  title: string;
  description: string;
}

export function TicketsPage({
  category,
  title,
  description,
}: TicketsPageProps) {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<
      ListTicketsStatus | "all"
    >("all");

  const debouncedSearch =
    useDebounce(search, 500);

  const {
    data,
    isLoading,
  } = useListTickets({
    category,
    search:
      debouncedSearch || undefined,
    status:
      status !== "all"
        ? status
        : undefined,
    limit: 50,
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-5 pb-8">
<section
  className="
  relative
  overflow-hidden
  rounded-[32px]
  border
  border-green-100
  bg-gradient-to-br
  from-white
  via-white
  to-green-50/70
  shadow-[0_20px_60px_rgba(0,0,0,.04)]
"
>
  {/* Decorative Blobs */}
  <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />

  {/* Header */}
  <div className="relative border-b border-green-100/80 px-8 py-8">
    <div className="flex flex-col gap-3">
      <div
        className="
        inline-flex
        w-fit
        items-center
        rounded-full
        bg-primary/10
        px-4
        py-1.5
        text-xs
        font-bold
        text-primary
      "
      >
        إدارة التذاكر
      </div>

      <h1
        className="
        text-4xl
        font-black
        tracking-tight
      "
      >
        {title}
      </h1>

      <p
        className="
        max-w-2xl
        text-base
        leading-8
        text-muted-foreground
      "
      >
        {description}
      </p>
    </div>
  </div>

  {/* Filters */}
  <div
    className="
    relative
    flex
    flex-col
    gap-4
    px-8
    py-6
    lg:flex-row
    lg:items-center
    lg:justify-between
  "
  >
    <div>
      <div className="flex items-center gap-2 font-bold">
        <Filter className="h-4 w-4 text-primary" />
        أدوات البحث والتصفية
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        ابحث بالعميل أو رقم الطلب ثم اختر حالة المعالجة.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative w-full sm:w-96">
        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="بحث عن طلب أو عميل..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            h-12
            rounded-2xl
            border-green-100
            bg-white
            pr-12
            shadow-sm
          "
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) =>
          setStatus(value as any)
        }
      >
        <SelectTrigger
          className="
            h-12
            w-full
            rounded-2xl
            border-green-100
            bg-white
            shadow-sm
            sm:w-56
          "
        >
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            جميع الحالات
          </SelectItem>

          <SelectItem value="NEW">
            جديدة
          </SelectItem>

          <SelectItem value="CONTACTED">
            تم التواصل
          </SelectItem>

          <SelectItem value="IN_PROGRESS">
            قيد المعالجة
          </SelectItem>

          <SelectItem value="PENDING_CUSTOMER">
            بانتظار العميل
          </SelectItem>

          <SelectItem value="RESOLVED">
            محلولة
          </SelectItem>

          <SelectItem value="CLOSED">
            مغلقة
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</section>

        <TicketTable
          tickets={
            data?.tickets ?? []
          }
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
}
