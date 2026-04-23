import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost } from "@/lib/apiClient";
import { fallbackSiteSettings } from "@/lib/fallbackData";
import type { SiteSettings } from "@/types/api";
import { API_STALE_TIME } from "@/config/api";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Required").max(200),
  message: z.string().trim().min(1, "Required").max(2000),
});
type Values = z.infer<typeof schema>;

const Contact = () => {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => apiGet<SiteSettings>("/site-settings"),
    staleTime: API_STALE_TIME,
  });
  const s = data ?? fallbackSiteSettings;

  const { register, handleSubmit, reset, formState } = useForm<Values>({ resolver: zodResolver(schema) });
  const send = useMutation({
    mutationFn: (v: Values) => apiPost("/contact", v),
    onSuccess: () => { toast.success("Message sent! We'll reply soon."); reset(); },
    onError: () => toast.error("Couldn't send message. Please try again."),
  });

  return (
    <>
      <PageHeader title="Contact Us" crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
      <section className="py-20 bg-background">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-display font-bold mb-3">Get in touch</h2>
            <p className="text-muted-foreground mb-8">We'd love to hear from you — questions, visits and admissions inquiries are warmly welcome.</p>
            <ul className="space-y-5">
              {[
                { icon: MapPin, label: "Address", value: s.address },
                { icon: Phone, label: "Phone", value: s.phone },
                { icon: Mail, label: "Email", value: s.email },
                { icon: Clock, label: "Hours", value: s.opening_hours },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-4 items-start">
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-secondary text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                    <p className="text-foreground font-medium">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit((v) => send.mutate(v))} className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-4">
            <div>
              <Label htmlFor="cn">Name</Label>
              <Input id="cn" {...register("name")} />
              {formState.errors.name && <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="ce">Email</Label>
              <Input id="ce" type="email" {...register("email")} />
              {formState.errors.email && <p className="text-xs text-destructive mt-1">{formState.errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="cs">Subject</Label>
              <Input id="cs" {...register("subject")} />
              {formState.errors.subject && <p className="text-xs text-destructive mt-1">{formState.errors.subject.message}</p>}
            </div>
            <div>
              <Label htmlFor="cm">Message</Label>
              <Textarea id="cm" rows={5} {...register("message")} />
              {formState.errors.message && <p className="text-xs text-destructive mt-1">{formState.errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={send.isPending} className="w-full rounded-full">
              {send.isPending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;