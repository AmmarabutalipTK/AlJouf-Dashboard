import { useState } from "react";
import { useLocation } from "wouter";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, User } from "lucide-react";

import { useAuth } from "@/App";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/api/client";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const loginMutation = useLogin();
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const handleLogin = async () => {
 try {
  const data =
    await loginMutation.mutateAsync({
      username,
      password,
    });

  login(data.token, data.user);
  navigate("/");
} catch (err: any) {
  console.error(err);

  setError(
    err?.response?.data?.message ??
      "اسم المستخدم أو كلمة المرور غير صحيحة"
  );
} finally {
  setLoading(false);
}
  };

return (
  <div
    dir="rtl"
    className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#fbfdfb] to-[#eef7f1]"
  >
    {/* Background Effects */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-52 -right-52 h-[700px] w-[700px] rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute -bottom-52 -left-52 h-[600px] w-[600px] rounded-full bg-green-200/30 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
    </div>

    <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.25fr_0.9fr]">
      {/* LEFT SIDE */}
      <section className="hidden lg:flex">
        <div className="flex h-full flex-col justify-between p-16">
          <div>
            <div className="flex items-center gap-5">
              <div
                className="
                flex h-24 w-24 items-center justify-center
                rounded-[32px]
                border border-white/50
                bg-white/90
                backdrop-blur-xl
                shadow-[0_30px_80px_rgba(0,0,0,.08)]
              "
              >
                <img
                  src="/logo/Aljouf_logo.png"
                  alt="Aljouf"
                  className="w-16 object-contain"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  الجوف للتنمية
                </h2>

                <p className="mt-1 text-muted-foreground">
                  منصة إدارة خدمة العملاء
                </p>
              </div>
            </div>

            <div className="mt-16 max-w-2xl">

              <h1
                className="
                mt-8
                text-6xl
                font-black
                leading-tight
              "
              >
                إدارة الشكاوى
                <br />
                والطلبات
                <br />
                بكل احترافية
              </h1>

              <p
                className="
                mt-8
                max-w-xl
                text-lg
                leading-9
                text-muted-foreground
              "
              >
                منصة موحدة لإدارة الطلبات والشكاوى ومتابعة
                سير العمل بين الفرق المختلفة مع تجربة
                تشغيلية حديثة وسريعة.
              </p>

              <div className="mt-12 grid grid-cols-3 gap-5">
                <div
                  className="
                  rounded-3xl
                  border
                  border-white/50
                  bg-white/80
                  p-6
                  backdrop-blur-xl
                "
                >
                  <div className="text-3xl font-black">
                    24/7
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    متابعة مستمرة
                  </div>
                </div>

                <div
                  className="
                  rounded-3xl
                  border
                  border-white/50
                  bg-white/80
                  p-6
                  backdrop-blur-xl
                "
                >
                  <div className="text-3xl font-black">
                    100%
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    إدارة مركزية
                  </div>
                </div>

                <div
                  className="
                  rounded-3xl
                  border
                  border-white/50
                  bg-white/80
                  p-6
                  backdrop-blur-xl
                "
                >
                  <div className="text-3xl font-black">
                    ∞
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    تتبع الطلبات
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4">

              <a
    href="https://aljouf-manual.takarubdev.com/"
    target="_blank"
    rel="noopener noreferrer"
className="text-sm text-muted-foreground underline"
  >
    دليل الجوف
  </a>
                      <p className="text-sm text-muted-foreground">
            © 2026 الجوف للتنمية
          </p>



          </div>


          
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <div
              className="
              flex h-24 w-24 items-center justify-center
              rounded-[32px]
              bg-white
              shadow-xl
            "
            >
              <img
                src="/logo/Aljouf_logo.png"
                className="w-16"
              />
            </div>
          </div>



          <Card
            className="
            rounded-[32px]
            border-white/60
            bg-white/80
            backdrop-blur-2xl
            shadow-[0_40px_100px_rgba(0,0,0,.10)]
          "
          >
            <CardContent className="p-8">
              <h2 className="text-3xl font-black">
                مرحباً بك
              </h2>

              <p className="mt-2 text-muted-foreground">
                أدخل بيانات الحساب للوصول إلى لوحة التحكم
              </p>

              <div className="mt-8 space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label className="mb-2 block">
                    اسم المستخدم
                  </Label>

                  <div className="relative">
                    <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />

                    <Input
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      placeholder="اسم المستخدم"
                      className="h-14 rounded-2xl pr-12"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">
                    كلمة المرور
                  </Label>

                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />

                    <Input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="••••••••"
                      className="h-14 rounded-2xl pr-12 pl-12"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={loginMutation.isPending}
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  text-base
                  font-bold
                "
                >
                  {loginMutation.isPending
                    ? "جارٍ التحقق..."
                    : "تسجيل الدخول"}

                  {!loginMutation.isPending && (
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  </div>
);
}
