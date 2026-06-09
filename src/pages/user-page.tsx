import { useState } from "react";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";

import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/api/client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";

function RoleBadge({ role }: { role: "ADMIN" | "USER" }) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-xs font-bold
        border shadow-sm
        ${
          role === "ADMIN"
            ? "bg-white border-green-200 text-primary"
            : "bg-white border-green-100 text-muted-foreground"
        }
      `}
    >
      {role === "ADMIN" ? "مدير" : "مستخدم"}
    </span>
  );
}

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "USER",
  });

  const debouncedSearch = useDebounce(search, 500);

  const { data: users = [], isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const reset = () => {
    setEditingUser(null);
    setForm({ username: "", password: "", role: "USER" });
  };

  const openCreate = () => {
    reset();
    setOpen(true);
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: "",
      role: user.role,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.username) return;

    if (editingUser) {
      await updateUser.mutateAsync({
        id: editingUser.id,
        data: {
          username: form.username,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        },
      });
    } else {
      await createUser.mutateAsync({
        username: form.username,
        password: form.password,
        role: form.role as "ADMIN" | "USER",
      });
    }

    setOpen(false);
    reset();
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-10">

        {/* HEADER (MATCHING TICKETS STYLE) */}
        <section className="overflow-hidden rounded-[36px] border border-green-100 bg-white shadow-[0_24px_80px_rgba(0,0,0,.06)]">

          <div className="border-b border-green-50 bg-gradient-to-l from-[#f3faf5] via-white to-white px-6 py-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              الصلاحيات
            </p>
            <h1 className="text-3xl font-black">المستخدمون</h1>
            <p className="text-sm text-muted-foreground">
              إدارة حسابات النظام والصلاحيات
            </p>
          </div>

          <div className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <Users className="h-4 w-4" />
              {filteredUsers.length} مستخدم
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-80">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث عن مستخدم..."
                  className="h-11 rounded-2xl border-green-100 bg-white pr-10 shadow-sm"
                />
              </div>

              <Button
                onClick={openCreate}
                className="h-11 rounded-2xl bg-primary font-bold shadow-sm"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة مستخدم
              </Button>
            </div>
          </div>
        </section>

        {/* TABLE (MATCHING TICKETS STYLE) */}
        <div className="overflow-hidden rounded-[36px] border border-green-100 bg-white shadow-[0_24px_80px_rgba(0,0,0,.06)]">

          <Table dir="rtl" className="min-w-[900px]">

            <TableHeader className="bg-gradient-to-l from-[#f3faf5] via-white to-white">
              <TableRow>
                <TableHead className="text-right font-black text-primary">اسم المستخدم</TableHead>
                <TableHead className="text-right font-black text-primary">الصلاحية</TableHead>
                <TableHead className="text-right font-black text-primary">تاريخ الإنشاء</TableHead>
                <TableHead className="text-left font-black text-primary">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    لا يوجد مستخدمون
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-green-50 hover:bg-[#f8fcf9]"
                  >
                    <TableCell className="font-bold">{user.username}</TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-xl border-green-100 bg-white shadow-sm"
                          onClick={() => openEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-xl border-green-100 bg-white shadow-sm text-red-500 hover:bg-red-50"
                          onClick={() => deleteUser.mutate(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>

        {/* DIALOG (light cleanup only) */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent dir="rtl" className="text-right sm:max-w-md">

            <DialogHeader>
              <DialogTitle>
                {editingUser ? "تعديل مستخدم" : "إضافة مستخدم"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">

              <Input
                placeholder="اسم المستخدم"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />

              <Input
                type="password"
                placeholder="كلمة المرور"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm({ ...form, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="الصلاحية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">مستخدم</SelectItem>
                  <SelectItem value="ADMIN">مدير</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSave} className="w-full rounded-2xl">
                حفظ
              </Button>

            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
}