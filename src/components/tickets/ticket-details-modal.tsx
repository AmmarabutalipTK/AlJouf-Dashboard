import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetTicket, getGetTicketQueryKey } from "@/api/client";
import { format } from "date-fns";
import { StatusBadge, CategoryBadge } from "./status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getCategoryLabel, getStatusLabel } from "@/helpers/getStatus";

interface TicketDetailsModalProps {
  id: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3006";

async function createNote(ticketId: number, message: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/tickets/${ticketId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  return res.json();
}

export function TicketDetailsModal({
  id,
  open,
  onOpenChange,
}: TicketDetailsModalProps) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useGetTicket(id || 0, {
    query: {
      enabled: !!id && open,
      queryKey: getGetTicketQueryKey(id || 0),
    },
  });

  const addNote = useMutation({
    mutationFn: async (msg: string) => {
      if (!id) throw new Error("Missing ticket id");
      return createNote(id, msg);
    },

    onSuccess: () => {
      setMessage("");

      if (id) {
        queryClient.invalidateQueries({
          queryKey: getGetTicketQueryKey(id),
        });
      }

      toast({
        title: "تم إضافة الملاحظة",
      });
    },

    onError: () => {
      toast({
        title: "فشل إضافة الملاحظة",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="items-start flex text-right mt-4">تفاصيل التذكرة #{id}</DialogTitle>
          <DialogDescription className="items-start flex text-right">
            عرض التفاصيل الكاملة للتذكرة
          </DialogDescription>
        </DialogHeader>

        {isLoading || !ticket ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-muted-foreground mb-1">
                  اسم العميل
                </h4>
                <p className="font-medium">{ticket.customerName}</p>
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground mb-1">
                  رقم الهاتف
                </h4>
                <p className="font-medium" >
                  {ticket.phone}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground mb-1">
                  رقم الطلب
                </h4>
                <p className="font-medium uppercase">
                  #{ticket.id}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground mb-1">
                  تاريخ الإنشاء
                </h4>
                <p className="font-medium">
                  {format(new Date(ticket.createdAt), "yyyy/MM/dd HH:mm")}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground mb-1">
                  التصنيف
                </h4>
              <CategoryBadge
  category={getCategoryLabel(ticket.category)}
/>
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground mb-1">
                  الحالة
                </h4>
                <StatusBadge
  status={getStatusLabel(ticket.status)}
/>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground mb-3">
                الملاحظات
              </h4>

              <div className="space-y-3 max-h-[300px] overflow-y-auto border rounded-md p-3">
                {(ticket.notes || []).map((note: any) => (
                  <div
                    key={note.id}
                    className="rounded-lg border bg-muted/40 p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{note.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(note.createdAt), "yyyy/MM/dd HH:mm")}
                      </span>
                    </div>

                    <p className="text-sm whitespace-pre-wrap">
                      {note.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب ملاحظة داخلية..."
                />

                <Button
                  className="w-full"
                  disabled={!message.trim() || !id || addNote.isPending}
                  onClick={() => addNote.mutate(message)}
                >
                  {addNote.isPending
                    ? "جاري الإرسال..."
                    : "إضافة ملاحظة"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}