import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { DashboardPage } from "@/pages/dashboard";
import { TicketsPage } from "@/pages/tickets-page";
import { LoginPage } from "@/pages/login";
import { ListTicketsCategory } from "@/api/client";
import { createContext, useContext, useState } from "react";
import { UsersPage } from "./pages/user-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

type User = {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
};

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");

    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ component: Component, ...props }: any) {
  const { isAuthenticated } = useAuth();

  return (
    <Route {...props}>
      {isAuthenticated ? <Component /> : <Redirect to="/login" />}
    </Route>
  );
}

function Router() {
  const { isAuthenticated,user } = useAuth();

  const isAdmin =user?.role==="ADMIN"

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/" /> : <LoginPage />}
      </Route>

      <PrivateRoute
        path="/"
        component={DashboardPage}
      />

      <PrivateRoute
        path="/complaints"
        component={() => (
          <TicketsPage
            category={ListTicketsCategory.COMPLAINT}
            title="الشكاوي"
            description="إدارة ومتابعة شكاوي العملاء"
          />
        )}
      />

      <PrivateRoute
        path="/modifications"
        component={() => (
          <TicketsPage
            category={ListTicketsCategory.ORDER_MODIFICATION}
            title="تعديلات الطلبات"
            description="طلبات تعديل المنتجات أو تفاصيل التوصيل"
          />
        )}
      />

      <PrivateRoute
        path="/cancellations"
        component={() => (
          <TicketsPage
            category={ListTicketsCategory.ORDER_CANCELLATION}
            title="إلغاء الطلبات"
            description="متابعة طلبات إلغاء الشراء"
          />
        )}
      />

      <PrivateRoute
        path="/returns"
        component={() => (
          <TicketsPage
            category={ListTicketsCategory.RETURN_REPLACEMENT}
            title="الاستبدال والاسترجاع"
            description="معالجة طلبات استرجاع واستبدال المنتجات"
          />
        )}
      />

      <PrivateRoute
        path="/delays"
        component={() => (
          <TicketsPage
            category={ListTicketsCategory.ORDER_DELAY_ERROR}
            title="الأخطاء والتأخير"
            description="متابعة التأخير في التوصيل والأخطاء التشغيلية"
          />
        )}
      />

{isAdmin&&            <PrivateRoute
        path="/users"
        component={() => (
          <UsersPage />
        )}
      />}

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter
          //@ts-ignore
            base={import.meta.env.BASE_URL.replace(/\/$/, "")}
          >
            <Router />
          </WouterRouter>

          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;