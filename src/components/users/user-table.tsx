import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
}

function RoleBadge({ role }: { role: User["role"] }) {
  const isAdmin = role === "ADMIN";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold
      ${
        isAdmin
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {isAdmin ? "مدير" : "مستخدم"}
    </span>
  );
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold">المستخدمون</h3>
          <p className="text-sm text-muted-foreground">
            قائمة جميع المستخدمين في النظام
          </p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            لا يوجد مستخدمون
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>اسم المستخدم</TableHead>
                <TableHead>الصلاحية</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/40 transition"
                >
                  <TableCell className="font-medium">
                    {user.id}
                  </TableCell>

                  <TableCell className="font-medium">
                    {user.username}
                  </TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}