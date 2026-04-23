import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CrudResource } from "@/components/admin/CrudResource";
import { apiGet, apiPatch, apiPut } from "@/lib/apiClient";
import type { Booking, ContactMessage, NewsletterSubscriber, AboutContent, SiteSettings } from "@/types/api";

export const AdminHero = () => (
  <CrudResource
    title="Hero Slides"
    endpoint="/admin/hero-slides"
    fields={[
      { key: "image", label: "Image", type: "image" },
      { key: "caption", label: "Caption" },
      { key: "subtitle", label: "Subtitle" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    columns={[
      { key: "id", label: "#" },
      { key: "caption", label: "Caption" },
      { key: "subtitle", label: "Subtitle" },
    ]}
  />
);

export const AdminClasses = () => (
  <CrudResource
    title="Classes"
    endpoint="/admin/classes"
    fields={[
      { key: "title", label: "Title" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      { key: "age_range", label: "Age range" },
      { key: "total_seats", label: "Total seats", type: "number" },
      { key: "class_time", label: "Class time" },
      { key: "monthly_fee", label: "Monthly fee" },
    ]}
    columns={[
      { key: "title", label: "Title" },
      { key: "age_range", label: "Age" },
      { key: "total_seats", label: "Seats" },
      { key: "monthly_fee", label: "Fee" },
    ]}
  />
);

export const AdminTeachers = () => (
  <CrudResource
    title="Teachers"
    endpoint="/admin/teachers"
    fields={[
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      { key: "twitter", label: "Twitter" },
      { key: "facebook", label: "Facebook" },
      { key: "linkedin", label: "LinkedIn" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
    ]}
  />
);

export const AdminFacilities = () => (
  <CrudResource
    title="Facilities"
    endpoint="/admin/facilities"
    fields={[
      { key: "icon_name", label: "Icon name (lucide)" },
      { key: "title", label: "Title" },
      { key: "description", label: "Description", type: "textarea" },
    ]}
    columns={[{ key: "title", label: "Title" }, { key: "icon_name", label: "Icon" }]}
  />
);

export const AdminTestimonials = () => (
  <CrudResource
    title="Testimonials"
    endpoint="/admin/testimonials"
    fields={[
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "parent_name", label: "Parent name" },
      { key: "profession", label: "Profession" },
      { key: "image", label: "Image", type: "image" },
    ]}
    columns={[{ key: "parent_name", label: "Parent" }, { key: "profession", label: "Profession" }]}
  />
);

export const AdminGallery = () => (
  <CrudResource
    title="Gallery"
    endpoint="/admin/gallery"
    fields={[
      { key: "image", label: "Image", type: "image" },
      { key: "category", label: "Category" },
    ]}
    columns={[{ key: "id", label: "#" }, { key: "category", label: "Category" }]}
  />
);

export const AdminBlog = () => (
  <CrudResource
    title="Blog Posts"
    endpoint="/admin/blog-posts"
    fields={[
      { key: "title", label: "Title" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content", label: "Content (HTML)", type: "textarea" },
      { key: "featured_image", label: "Featured image", type: "image" },
      { key: "author", label: "Author" },
      { key: "category", label: "Category" },
      { key: "tags", label: "Tags (comma-separated)" },
    ]}
    columns={[{ key: "title", label: "Title" }, { key: "author", label: "Author" }, { key: "category", label: "Category" }]}
  />
);

export const AdminAbout = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-about"],
    queryFn: () => apiGet<AboutContent>("/admin/about").catch(() => null),
  });
  const [form, setForm] = useState<AboutContent>({ title: "", description: "", bullet_points: [] });
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: () => apiPut("/admin/about", form),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-about"] }); },
    onError: () => toast.error("Save failed (backend not ready)"),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-display font-bold">About Page Content</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div>
          <Label>Bullet points</Label>
          <div className="space-y-2 mt-1">
            {form.bullet_points.map((bp, i) => (
              <div key={i} className="flex gap-2">
                <Input value={bp} onChange={(e) => {
                  const next = [...form.bullet_points]; next[i] = e.target.value;
                  setForm({ ...form, bullet_points: next });
                }} />
                <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, bullet_points: form.bullet_points.filter((_, idx) => idx !== i) })}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setForm({ ...form, bullet_points: [...form.bullet_points, ""] })}>
              <Plus className="w-4 h-4 mr-1" /> Add bullet
            </Button>
          </div>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
};

export const AdminSettings = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => apiGet<SiteSettings>("/admin/site-settings").catch(() => null),
  });
  const [form, setForm] = useState<SiteSettings>({ address: "", email: "", phone: "", opening_hours: "" });
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: () => apiPut("/admin/site-settings", form),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-settings"] }); },
    onError: () => toast.error("Save failed (backend not ready)"),
  });

  const fields: [keyof SiteSettings, string][] = [
    ["school_name", "School name"], ["tagline", "Tagline"], ["address", "Address"], ["phone", "Phone"],
    ["email", "Email"], ["opening_hours", "Opening hours"], ["facebook", "Facebook"], ["twitter", "Twitter"],
    ["instagram", "Instagram"], ["linkedin", "LinkedIn"], ["whatsapp", "WhatsApp"],
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-display font-bold">Site Settings</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {fields.map(([k, label]) => (
          <div key={k}>
            <Label>{label}</Label>
            <Input value={(form[k] as string) ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
};

export const AdminMessages = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => apiGet<ContactMessage[]>("/admin/contact-messages").catch(() => [] as ContactMessage[]),
  });
  const toggle = useMutation({
    mutationFn: (id: number) => apiPatch(`/admin/contact-messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Contact Messages</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr className="text-left"><th className="px-4 py-3">Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Read</th></tr></thead>
          <tbody>
            {(data ?? []).map((m) => (
              <tr key={m.id} className="border-t border-border/50">
                <td className="px-4 py-3">{m.name}</td><td>{m.email}</td><td>{m.subject}</td>
                <td>{format(new Date(m.created_at), "MMM d, yyyy")}</td>
                <td><input type="checkbox" checked={m.is_read} onChange={() => toggle.mutate(m.id)} /></td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No messages yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminBookings = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => apiGet<Booking[]>("/admin/bookings").catch(() => [] as Booking[]),
  });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => apiPatch(`/admin/bookings/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Bookings</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr className="text-left"><th className="px-4 py-3">Name</th><th>Email</th><th>Phone</th><th>Class</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {(data ?? []).map((b) => (
              <tr key={b.id} className="border-t border-border/50">
                <td className="px-4 py-3">{b.name}</td><td>{b.email}</td><td>{b.phone}</td><td>{b.class_title ?? `#${b.class_id}`}</td>
                <td>
                  <select value={b.status} onChange={(e) => update.mutate({ id: b.id, status: e.target.value })} className="bg-background border border-border rounded px-2 py-1 text-xs">
                    <option value="pending">pending</option><option value="confirmed">confirmed</option><option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td>{format(new Date(b.created_at), "MMM d, yyyy")}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminNewsletter = () => {
  const { data } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: () => apiGet<NewsletterSubscriber[]>("/admin/newsletter/subscribers").catch(() => [] as NewsletterSubscriber[]),
  });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Newsletter Subscribers</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr className="text-left"><th className="px-4 py-3">Name</th><th>Email</th><th>Subscribed</th></tr></thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id} className="border-t border-border/50">
                <td className="px-4 py-3">{s.name}</td><td>{s.email}</td><td>{format(new Date(s.created_at), "MMM d, yyyy")}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};