import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/apiClient";

const schema = z.object({
  username: z.string().trim().min(1, "Required").max(100),
  password: z.string().min(1, "Required").max(200),
});
type Values = z.infer<typeof schema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });
  const login = useMutation({
    mutationFn: (v: Values) => apiPost<{ access_token: string; token_type: string }>("/auth/admin/login", v),
    onSuccess: (res) => {
      localStorage.setItem("admin_token", res.access_token);
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    },
    onError: () => toast.error("Invalid credentials or backend offline."),
  });

  return (
    <div className="min-h-screen grid place-items-center bg-secondary p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-card border border-border p-8">
        <div className="text-center mb-6">
          <span className="inline-grid place-items-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-3">
            <Star className="w-6 h-6" />
          </span>
          <h1 className="text-2xl font-display font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">F&amp;F Islamic Super Kiddies Centre</p>
        </div>
        <form onSubmit={handleSubmit((v) => login.mutate(v))} className="space-y-4">
          <div>
            <Label htmlFor="u">Username</Label>
            <Input id="u" autoFocus {...register("username")} />
            {formState.errors.username && <p className="text-xs text-destructive mt-1">{formState.errors.username.message}</p>}
          </div>
          <div>
            <Label htmlFor="p">Password</Label>
            <Input id="p" type="password" {...register("password")} />
            {formState.errors.password && <p className="text-xs text-destructive mt-1">{formState.errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;