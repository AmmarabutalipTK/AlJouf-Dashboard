import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { TicketFormModal } from "../tickets/ticket-form";

export function AppLayout({ children }: { children: ReactNode }) {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex text-right" dir="rtl">
      <Sidebar onNewTicket={() => setIsNewTicketOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px] space-y-6">
            {children}
          </div>
        </main>
      </div>
      
      <TicketFormModal 
        open={isNewTicketOpen} 
        onOpenChange={setIsNewTicketOpen} 
      />
    </div>
  );
}
