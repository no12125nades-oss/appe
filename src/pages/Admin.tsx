import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  ArrowLeft,
  Users,
  UserCheck,
  Crown,
  Calendar,
  Loader2,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (!authLoading && isAuthenticated && !isAdmin) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  const {
    data: users,
    isLoading: usersLoading,
  } = trpc.auth.listUsers.useQuery(undefined, {
    enabled: isAdmin,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const totalUsers = users?.length ?? 0;
  const adminCount = users?.filter((u) => u.role === "admin").length ?? 0;
  const regularUsers = totalUsers - adminCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white/60 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200">
            <Crown className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              {user?.name}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={totalUsers}
            color="slate"
          />
          <StatCard
            icon={<UserCheck className="w-5 h-5" />}
            label="Regular Users"
            value={regularUsers}
            color="blue"
          />
          <StatCard
            icon={<Crown className="w-5 h-5" />}
            label="Admins"
            value={adminCount}
            color="amber"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              All Users
            </h2>
            <span className="text-sm text-slate-400">
              {totalUsers} total
            </span>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-500 font-medium">ID</TableHead>
                  <TableHead className="text-slate-500 font-medium">Name</TableHead>
                  <TableHead className="text-slate-500 font-medium">Email</TableHead>
                  <TableHead className="text-slate-500 font-medium">Role</TableHead>
                  <TableHead className="text-slate-500 font-medium">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u) => (
                  <TableRow
                    key={u.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="text-slate-500 font-mono text-sm">
                      #{u.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                          {u.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                        <span className="font-medium text-slate-900">
                          {u.name ?? "Unnamed"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                          <UserCheck className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "slate" | "blue" | "amber";
}) {
  const colorClasses = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
