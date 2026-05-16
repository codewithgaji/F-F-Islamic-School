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
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(100),

  password: z
    .string()
    .min(1, "Password is required")
    .max(200),
});

type Values = z.infer<typeof schema>;

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useMutation({
    mutationFn: async (values: Values) => {
      return apiPost<{
        token: string;
        message: string;
      }>("/auth/login", values);
    },

    onSuccess: (res) => {
      localStorage.setItem("admin_token", res.token);

      toast.success(res.message || "Welcome back!");

      navigate("/admin/dashboard");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Invalid credentials or backend offline.";

      toast.error(message);
    },
  });

  return (
    <div className="min-h-screen grid place-items-center bg-secondary p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-card border border-border p-8">
        <div className="text-center mb-6">
          <span className="inline-grid place-items-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-3">
            <Star className="w-6 h-6" />
          </span>

          <h1 className="text-2xl font-display font-bold">
            Admin Login
          </h1>

          <p className="text-sm text-muted-foreground">
            F&amp;F Islamic Super Kiddies Centre
          </p>
        </div>

        <form
          onSubmit={handleSubmit((values) => login.mutate(values))}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              autoFocus
              autoComplete="email"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;