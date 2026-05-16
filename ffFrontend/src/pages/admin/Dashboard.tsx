import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, BookOpen, Mail } from "lucide-react";
import { apiGet } from "@/lib/apiClient";
import type { Booking } from "@/types/api";
import { format } from "date-fns";

const StatCard = ({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number | string }) => (
  <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
    <span className="grid place-items-center w-12 h-12 rounded-full bg-secondary text-primary"><Icon className="w-5 h-5" /></span>
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const useStat = (key: string, url: string) =>
  useQuery({ queryKey: ["stat", key], queryFn: () => apiGet<{ count: number }>(url).catch(() => ({ count: 0 })) });

const Dashboard = () => {
  const students = useStat("students", "/admin/stats/students");
  const teachers = useStat("teachers", "/admin/stats/teachers");
  const classes = useStat("classes", "/admin/stats/classes");
  const messages = useStat("messages", "/admin/stats/messages");

  const { data: bookings } = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: () => apiGet<Booking[]>("/admin/submissions/bookings").catch(() => [] as Booking[]),
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold">Welcome back</h2>
        <p className="text-muted-foreground text-sm">An overview of your school.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Students" value={students.data?.count ?? "—"} />
        <StatCard icon={GraduationCap} label="Teachers" value={teachers.data?.count ?? "—"} />
        <StatCard icon={BookOpen} label="Classes" value={classes.data?.count ?? "—"} />
        <StatCard icon={Mail} label="Messages" value={messages.data?.count ?? "—"} />
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display font-semibold mb-4">Recent bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border text-muted-foreground">
                <th className="py-2">Name</th><th>Email</th><th>Class</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(bookings ?? []).slice(0, 8).map((b) => (
                <tr key={b.id} className="border-b border-border/50">
                  <td className="py-2 text-foreground">{b.name}</td>
                  <td>{b.email}</td>
                  <td>{b.class_title ?? `#${b.class_id}`}</td>
                  <td><span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-foreground">{b.status}</span></td>
                  <td>{format(new Date(b.created_at), "MMM d, yyyy")}</td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No bookings yet — they'll appear once the API is live.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;