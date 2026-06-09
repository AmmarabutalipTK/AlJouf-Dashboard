export function getStatusLabel(status?: string) {
  switch (status) {
    case "NEW":
      return "جديدة";

    case "CONTACTED":
      return "تم التواصل";

    case "IN_PROGRESS":
      return "قيد المعالجة";

    case "PENDING_CUSTOMER":
      return "بانتظار العميل";

    case "RESOLVED":
      return "تم الحل";

    case "CLOSED":
      return "مغلقة";

    default:
      return "-";
  }
}

export function getCategoryLabel(category?: string) {
  switch (category) {
    case "COMPLAINT":
      return "شكوى";

    case "ORDER_MODIFICATION":
      return "تعديل طلب";

    case "ORDER_CANCELLATION":
      return "إلغاء طلب";

    case "RETURN_REPLACEMENT":
      return "استرجاع / استبدال";

    case "ORDER_DELAY_ERROR":
      return "تأخير أو خطأ";

    default:
      return "-";
  }
}