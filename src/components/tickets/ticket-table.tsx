import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, CheckCircle, Clock, CheckCircle2, PlayCircle, Loader2, Eye, MessageSquare } from "lucide-react";
import { Ticket, TicketUpdateStatus, useUpdateTicket, useDeleteTicket, getListTicketsQueryKey, getGetStatsQueryKey } from "@/api/client";
import { CategoryBadge } from "./status-badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketDetailsModal } from "./ticket-details-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/App";

interface TicketTableProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export function TicketTable({ tickets, isLoading }: TicketTableProps) {

  const { user } = useAuth();
const isAdmin = user?.role === "ADMIN";
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);



const handleAljoufNoteChange = (id: number, aljoufNote: string) => {
  updateTicket.mutate(
    { id, data: { aljoufNote } },
    {
      onSuccess: () => {
        toast({ title: "تم تحديث ملاحظة الجوف" });
        queryClient.invalidateQueries({ queryKey: getListTicketsQueryKey() });
      },
      onError: () => {
        toast({ title: "فشل تحديث الملاحظة", variant: "destructive" });
      },
    }
  );
};



  const handleStatusChange = (id: number, status: TicketUpdateStatus) => {
    setUpdatingId(id);
    updateTicket.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({ title: "تم تحديث حالة التذكرة" });
          queryClient.invalidateQueries({ queryKey: getListTicketsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          setUpdatingId(null);
        },
        onError: () => {
          toast({ title: "حدث خطأ أثناء التحديث", variant: "destructive" });
          setUpdatingId(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه التذكرة؟")) return;
    setUpdatingId(id);
    deleteTicket.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "تم حذف التذكرة" });
          queryClient.invalidateQueries({ queryKey: getListTicketsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          setUpdatingId(null);
        },
        onError: () => {
          toast({ title: "حدث خطأ أثناء الحذف", variant: "destructive" });
          setUpdatingId(null);
        },
      }
    );
  };

  const getDetails = (ticket: Ticket) => {
    switch (ticket.category) {
      case "COMPLAINT":
        return ticket.description || "-";
      case "ORDER_MODIFICATION":
        return [
          ticket.operation,
          ticket.productType,
          ticket.quantity && `${ticket.quantity} قطعة`,
        ].filter(Boolean).join(" - ") || "-";
      case "ORDER_CANCELLATION":
        return [
          ticket.operation,
          ticket.productType,
          ticket.quantity && `${ticket.quantity} قطعة`,
        ].filter(Boolean).join(" - ") || "-";
      case "RETURN_REPLACEMENT":
        return [ticket.subCategory, ticket.reason].filter(Boolean).join(" - ") || "-";
      case "ORDER_DELAY_ERROR":
        return [ticket.title, ticket.subCategory].filter(Boolean).join(" - ") || "-";
      default:
        return "-";
    }
  };

  const renderStatusCell = (ticket: Ticket) => {
    const isUpdating = updatingId === ticket.id;

if (ticket.category === "COMPLAINT") {
  return (
    <div className="space-y-1">
      {isUpdating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Select
          dir="rtl"
          value={ticket.complaintStatus ?? "قيد المعالجة"}
          onValueChange={(value) => {
            setUpdatingId(ticket.id);

            updateTicket.mutate(
              {
                id: ticket.id,
                data: {
                  complaintStatus: value,

                  status:
                    value === "تم حلها"
                      ? TicketUpdateStatus.RESOLVED
                      : TicketUpdateStatus.IN_PROGRESS,
                },
              },
              {
                onSuccess: () => {
                  toast({
                    title: "تم تحديث حالة الشكوى",
                  });

                  queryClient.invalidateQueries({
                    queryKey: ["tickets"],
                  });

                  queryClient.invalidateQueries({
                    queryKey: ["ticket", ticket.id],
                  });

                  queryClient.invalidateQueries({
                    queryKey: ["stats"],
                  });

                  setUpdatingId(null);
                },

                onError: () => {
                  toast({
                    title: "فشل تحديث الحالة",
                    variant: "destructive",
                  });

                  setUpdatingId(null);
                },
              }
            );
          }}
        >
          <SelectTrigger className="h-9 min-w-44 bg-background">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="قيد المعالجة">
              قيد المعالجة
            </SelectItem>

            <SelectItem value="تم حلها">
              تم حلها
            </SelectItem>
          </SelectContent>
        </Select>
      )}

      {ticket.complaintStatusUpdatedBy && (
        <div className="text-xs text-muted-foreground">
          آخر تعديل بواسطة:
          {" "}
          {ticket.complaintStatusUpdatedBy}
        </div>
      )}
    </div>
  );
}

    if (ticket.category === "ORDER_CANCELLATION") {
      return isUpdating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Select
          dir="rtl"
          value={(ticket as any).cancellationStatus ?? "قيد المعالجة"}
          onValueChange={(value) => handleAljoufNoteChange(ticket.id, value)}
        >
          <SelectTrigger className="h-9 min-w-44 bg-background">
            <SelectValue defaultValue={ticket.aljoufNote} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="قيد المعالجة">{ticket.aljoufNote}</SelectItem>
            <SelectItem value="تم اعادة المبلغ">تم اعادة المبلغ</SelectItem>
            <SelectItem value="تم توصيل الشحنة الى العميل">تم توصيل الشحنة الى العميل</SelectItem>
            <SelectItem value="تم التواصل مع العميل">تم التواصل مع العميل</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return <span className="text-muted-foreground text-sm">-</span>;
  };

  if (isLoading) {
    return (
      <div className="dashboard-panel overflow-hidden">
        <Table className="min-w-[980px]">
          <TableHeader className="bg-secondary/70">
            <TableRow>
              <TableHead>رقم التذكرة</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>رقم الهاتف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="py-3"><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-6 w-20 rounded-md" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="dashboard-panel flex flex-col items-center justify-center border-dashed p-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">لا توجد تذاكر</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">
          جميع الأمور على ما يرام. لا توجد تذاكر في هذا التصنيف حالياً.
        </p>
      </div>
    );
  }

return (
  <div className="space-y-6">
<div className="overflow-hidden rounded-[36px] border border-green-100 bg-white shadow-[0_24px_80px_rgba(0,0,0,.06)]">
      
      <Table className="min-w-[1180px]">
       <TableHeader className="bg-gradient-to-l from-[#f3faf5] via-white to-white">
          <TableRow>
          <TableHead className="h-16 text-right font-black text-primary">
              التذكرة
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              العميل
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              رقم الهاتف
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              التصنيف
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              الشكوى أو الملاحظة
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              الحالة
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              التاريخ
            </TableHead>

            <TableHead className="h-16 text-right font-black text-primary">
              الملاحظات
            </TableHead>

            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              className="
                group
  border-b
  border-green-50
  transition-all
  hover:bg-[#f8fcf9]
            "
            >
              <TableCell className="">
                <div
                  className="
                  inline-flex
                  rounded-full
                  bg-white
border
border-green-100
shadow-sm
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-primary
                "
                >
                  #{ticket.id}
                </div>
              </TableCell>

              <TableCell className="">
                <div className="font-semibold text-foreground">
                  {ticket.customerName ||
                    (ticket.orderNumber
                      ? `طلب #${ticket.orderNumber}`
                      : "-")}
                </div>
              </TableCell>

              <TableCell className="">
                <div className="font-mono text-sm text-muted-foreground">
                  {ticket.phone || "-"}
                </div>
              </TableCell>

              <TableCell className="">
                <CategoryBadge
                  category={
                    ticket.category === "COMPLAINT"
                      ? "شكوى"
                      : ticket.category ===
                        "ORDER_MODIFICATION"
                      ? "تعديل طلب"
                      : ticket.category ===
                        "ORDER_CANCELLATION"
                      ? "إلغاء طلب"
                      : ticket.category ===
                        "RETURN_REPLACEMENT"
                      ? "استرجاع/استبدال"
                      : ticket.category ===
                        "ORDER_DELAY_ERROR"
                      ? "تأخير/خطأ"
                      : "-"
                  }
                />
              </TableCell>

              <TableCell className="max-w-[320px] ">
                <div
                  className="
  rounded-2xl
  bg-white
border
border-green-100
shadow-sm/50
  px-4
  py-3
  text-sm
"
                  title={getDetails(ticket)}
                >
                  {getDetails(ticket)}
                </div>
              </TableCell>

              <TableCell className="min-w-[240px] ">
                {renderStatusCell(ticket)}
              </TableCell>

              <TableCell className="whitespace-nowrap  text-sm text-muted-foreground">
                {ticket.complaintSubmittedAt
                  ? format(
                      new Date(
                        ticket.complaintSubmittedAt
                      ),
                      "yyyy/MM/dd"
                    )
                  : ticket.createdAt
                  ? format(
                      new Date(ticket.createdAt),
                      "yyyy/MM/dd"
                    )
                  : "-"}
              </TableCell>

              <TableCell className="">
            <Button
             onClick={() => setDetailsId(ticket.id)}
  variant="outline"
  size="sm"
  className="
    h-11
    rounded-2xl
    border-green-100
    bg-white
    font-semibold
    shadow-sm
  "
>
                  <MessageSquare className="ml-2 h-4 w-4" />
                  الملاحظات
                </Button>
              </TableCell>

              <TableCell className=" text-left">
                {updatingId === ticket.id ? (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="
                        rounded-xl
                        bg-white
border
border-green-100
shadow-sm
                        hover:bg-green-100
                      "
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                    
                      className="
                      w-56
                      rounded-2xl
                      border-green-100
                      ml-20
                    "
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          setDetailsId(ticket.id)
                        }
                      >
                        <Eye className="ml-2 h-4 w-4" />
                        عرض التفاصيل
                      </DropdownMenuItem>


                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleDelete(ticket.id)
                          }
                          className="
                          text-destructive
                          focus:bg-destructive/10
                          focus:text-destructive
                        "
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف التذكرة
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TicketDetailsModal
        id={detailsId}
        open={detailsId !== null}
        onOpenChange={(open) =>
          !open && setDetailsId(null)
        }
      />
    </div>
  </div>
);
}
