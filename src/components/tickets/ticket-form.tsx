import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateTicket, getListTicketsQueryKey, getGetStatsQueryKey, getGetStatsByCategoryQueryKey, getGetStatsTrendQueryKey, TicketInputCategory } from "@/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ticketSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب (حرفين على الأقل)"),
  phone: z.string().min(9, "رقم الهاتف مطلوب"),
  orderNumber: z.string().min(3, "رقم الطلب مطلوب"),
  category: z.nativeEnum(TicketInputCategory, { required_error: "يرجى اختيار التصنيف" }),
  notes: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function TicketFormModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      orderNumber: "",
      category: undefined,
      notes: "",
    },
  });

  const createTicket = useCreateTicket();

  const onSubmit = (data: TicketFormValues) => {
    createTicket.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "تم إنشاء التذكرة بنجاح", variant: "default" });
        queryClient.invalidateQueries({ queryKey: getListTicketsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsByCategoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsTrendQueryKey() });
        form.reset();
        onOpenChange(false);
      },
      onError: () => {
        toast({ title: "حدث خطأ أثناء إنشاء التذكرة", variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">إنشاء تذكرة جديدة</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم العميل</FormLabel>
                    <FormControl>
                      <Input placeholder="أحمد محمد" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="05XXXXXXXX" dir="ltr" className="text-right" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الطلب</FormLabel>
                    <FormControl>
                      <Input placeholder="ORD-1234" dir="ltr" className="text-right uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التصنيف</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التصنيف" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="complaints">شكوى</SelectItem>
                        <SelectItem value="modifications">تعديل طلب</SelectItem>
                        <SelectItem value="cancellations">إلغاء طلب</SelectItem>
                        <SelectItem value="returns">استبدال / استرجاع</SelectItem>
                        <SelectItem value="delays">أخطاء وتأخير</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات إضافية</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="تفاصيل المشكلة..." 
                      className="resize-none h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={createTicket.isPending}>
                {createTicket.isPending && <Loader2 className="ml-2 w-4 h-4 animate-spin" />}
                حفظ التذكرة
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}