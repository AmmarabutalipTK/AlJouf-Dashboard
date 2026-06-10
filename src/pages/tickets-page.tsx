import { useState } from "react";

import { AppLayout } from "@/components/layout/app-layout";
import { TicketTable } from "@/components/tickets/ticket-table";

import {
  useListTickets,
  ListTicketsCategory,
  ListTicketsStatus,
} from "@/api/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

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
  const [status, setStatus] =
    useState<ListTicketsStatus | "all">(
      "all"
    );

  const [page, setPage] =
    useState(1);

  const limit = 50;

  const {
    data,
    isLoading,
  } = useListTickets({
    category,
    status:
      status !== "all"
        ? status
        : undefined,
    page,
    limit,
  });

  const total =
    data?.total ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );

  const handleStatusChange = (
    value: string
  ) => {
    setStatus(
      value as
        | ListTicketsStatus
        | "all"
    );

    setPage(1);
  };

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
                ابحث بالعميل أو رقم الطلب ثم اختر حالة
                المعالجة.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Select
                dir="rtl"
                value={status}
                onValueChange={
                  handleStatusChange
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

                <SelectContent dir="rtl">
                  <SelectItem value="all">
                    جميع الحالات
                  </SelectItem>

                  <SelectItem value="IN_PROGRESS">
                    قيد المعالجة
                  </SelectItem>

                  <SelectItem value="RESOLVED">
                    محلولة
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (prev) => prev - 1
                )
              }
            >
              السابق
            </Button>

            <div className="rounded-lg border bg-white px-4 py-2 text-sm font-medium">
              صفحة {page} من{" "}
              {totalPages}
            </div>

            <Button
              variant="outline"
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage(
                  (prev) => prev + 1
                )
              }
            >
              التالي
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}