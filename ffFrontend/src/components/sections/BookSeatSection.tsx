import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "@/components/SectionTitle";
import { apiGet, apiPost } from "@/lib/apiClient";
import { fallbackClasses } from "@/lib/fallbackData";
import type { SchoolClass } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(6, "Phone required").max(30),
  class_id: z.string().min(1, "Please select a class"),
});
type Values = z.infer<typeof schema>;

const benefits = [
  "Small class sizes for personal attention",
  "Holistic Islamic & academic curriculum",
  "Caring, qualified teachers",
  "Safe and joyful learning environment",
];

export const BookSeatSection = () => {
  const { data: classes } = useQuery({
    queryKey: ["classes-options"],
    queryFn: () => apiGet<SchoolClass[]>("/classes", { limit: "all" }),
    staleTime: API_STALE_TIME,
  });
  const options = (classes && classes.length > 0 ? classes : fallbackClasses).map((c) => ({
    id: c.id,
    title: c.title,
  }));

  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const book = useMutation({
    mutationFn: (v: Values) => apiPost("/bookings", { ...v, class_id: Number(v.class_id) }),
    onSuccess: () => {
      toast.success("Booking received! We'll be in touch soon.");
      reset();
    },
    onError: () => toast.error("Couldn't submit booking. Please try again."),
  });

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionTitle label="Reserve Your Spot" title="Book a seat for your child" align="left" />
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Spaces fill up quickly. Tell us about your child and we'll guide you through the simple admission steps.
          </p>
          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3 text-foreground">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-primary text-primary-foreground mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit((v) => book.mutate(v))}
          className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border space-y-4"
        >
          <h3 className="font-display text-2xl font-semibold mb-2">Quick booking form</h3>

          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} />
            {formState.errors.name && <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {formState.errors.email && <p className="text-xs text-destructive mt-1">{formState.errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {formState.errors.phone && <p className="text-xs text-destructive mt-1">{formState.errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <Label>Class</Label>
            <Select value={watch("class_id") ?? ""} onValueChange={(v) => setValue("class_id", v, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.id} value={String(o.id)}>
                    {o.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState.errors.class_id && <p className="text-xs text-destructive mt-1">{formState.errors.class_id.message}</p>}
          </div>

          <Button type="submit" disabled={book.isPending} className="w-full rounded-full">
            {book.isPending ? "Submitting…" : "Book A Seat"}
          </Button>
        </form>
      </div>
    </section>
  );
};