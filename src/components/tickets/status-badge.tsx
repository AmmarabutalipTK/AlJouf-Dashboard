import { Badge } from "@/components/ui/badge";
export function StatusBadge({
  status,
}: {
  status?: string | null;
}) {
  switch (status) {
    case "NEW":
      return (
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
          جديدة
        </Badge>
      );

    case "CONTACTED":
      return (
        <Badge className="border-cyan-500/20 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20">
          تم التواصل
        </Badge>
      );

    case "IN_PROGRESS":
      return (
        <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
          قيد المعالجة
        </Badge>
      );

    case "PENDING_CUSTOMER":
      return (
        <Badge className="border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
          بانتظار العميل
        </Badge>
      );

    case "RESOLVED":
      return (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
          تم الحل
        </Badge>
      );

    case "CLOSED":
      return (
        <Badge className="border-slate-500/20 bg-slate-500/10 text-slate-500 hover:bg-slate-500/20">
          مغلقة
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {status || "-"}
        </Badge>
      );
  }
}

export function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { label: string; className: string }> = {
    complaints: {
      label: "شكوى",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    modifications: {
      label: "تعديل",
      className: "border-violet-200 bg-violet-50 text-violet-700",
    },
    cancellations: {
      label: "إلغاء",
      className: "border-orange-200 bg-orange-50 text-orange-700",
    },
    returns: {
      label: "استرجاع",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },
    delays: {
      label: "تأخير",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    "شكوى": {
      label: "شكوى",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    "تعديل طلب": {
      label: "تعديل طلب",
      className: "border-violet-200 bg-violet-50 text-violet-700",
    },
    "إلغاء طلب": {
      label: "إلغاء طلب",
      className: "border-orange-200 bg-orange-50 text-orange-700",
    },
    "استرجاع/استبدال": {
      label: "استرجاع/استبدال",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },
    "تأخير/خطأ": {
      label: "تأخير/خطأ",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
  };

  const item = map[category] ?? {
    label: category,
    className: "border-border bg-muted text-muted-foreground",
  };

  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-bold ${item.className}`}>
      {item.label}
    </span>
  );
}
