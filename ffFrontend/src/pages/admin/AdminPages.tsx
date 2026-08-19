import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CrudResource } from "@/components/admin/CrudResource";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/apiClient";
import type { Booking, ContactMessage, NewsletterSubscriber, AboutContent, SiteSettings } from "@/types/api";

export const AdminHero = () => {
  const qc = useQueryClient();
  return (
    <CrudResource
      title="Hero Slides"
      endpoint="/admin/hero-slides"
      fields={[
        { key: "image",     label: "Image",               type: "image"    },
        { key: "caption",   label: "Caption",              type: "text"     },
        { key: "subtitle",  label: "Subtitle",             type: "textarea" },
        { key: "order",     label: "Order",                type: "number"   },
        { key: "is_active", label: "Active (true/false)",  type: "text"     },
      ]}
      columns={[
        { key: "id",      label: "#"       },
        { key: "caption", label: "Caption" },
        { key: "order",   label: "Order"   },
        {
          key: "image_url",
          label: "Image",
          render: (row) =>
            row.image_url ? (
              <img src={row.image_url as string} alt="" className="h-10 w-16 object-cover rounded" />
            ) : (
              <span className="text-muted-foreground text-xs">No image</span>
            ),
        },
      ]}
      onMutateSuccess={() => {
        // invalidate public hero query so frontend reflects change
        qc.invalidateQueries({ queryKey: ["hero-slides"] });
      }}
    />
  );
};

export const AdminClasses = () => {
  const qc = useQueryClient();
  return (
    <CrudResource
      title="Classes"
      endpoint="/admin/classes"
      fields={[
        { key: "title",       label: "Title"                          },
        { key: "description", label: "Description",  type: "textarea" },
        { key: "image",       label: "Image",        type: "image"    },
        { key: "age_range",   label: "Age range"                      },
        { key: "total_seats", label: "Total seats",  type: "number"   },
        { key: "class_time",  label: "Class time"                     },
        { key: "monthly_fee", label: "Monthly fee"                    },
      ]}
      columns={[
        { key: "title",       label: "Title" },
        { key: "age_range",   label: "Age"   },
        { key: "total_seats", label: "Seats" },
        { key: "monthly_fee", label: "Fee"   },
      ]}
      onMutateSuccess={() => {
        qc.invalidateQueries({ queryKey: ["classes"] });
      }}
    />
  );
};

export const AdminTeachers = () => {
  const qc = useQueryClient();
  return (
    <CrudResource
      title="Teachers"
      endpoint="/admin/teachers"
      fields={[
        { key: "name",     label: "Name"                        },
        { key: "role",     label: "Role"                        },
        { key: "bio",      label: "Bio",      type: "textarea"  },
        { key: "image",    label: "Image",    type: "image"     },
        { key: "twitter",  label: "Twitter"                     },
        { key: "facebook", label: "Facebook"                    },
        { key: "linkedin", label: "LinkedIn"                    },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
      ]}
      onMutateSuccess={() => {
        qc.invalidateQueries({ queryKey: ["teachers"] });
      }}
    />
  );
};

export const AdminFacilities = () => {
  const qc = useQueryClient();
  return (
    <CrudResource
      title="Facilities"
      endpoint="/admin/facilities"
      fields={[
        { key: "icon_name",   label: "Icon name (lucide)"              },
        { key: "title",       label: "Title"                           },
        { key: "description", label: "Description", type: "textarea"   },
      ]}
      columns={[
        { key: "title",     label: "Title" },
        { key: "icon_name", label: "Icon"  },
      ]}
      onMutateSuccess={() => {
        qc.invalidateQueries({ queryKey: ["facilities"] });
      }}
    />
  );
};

export const AdminTestimonials = () => {
  const qc = useQueryClient();
  return (
    <CrudResource
      title="Testimonials"
      endpoint="/admin/testimonials"
      fields={[
        { key: "quote",       label: "Quote",       type: "textarea" },
        { key: "parent_name", label: "Parent name"                   },
        { key: "profession",  label: "Profession"                    },
        { key: "image",       label: "Image",       type: "image"    },
      ]}
      columns={[
        { key: "parent_name", label: "Parent"     },
        { key: "profession",  label: "Profession" },
      ]}
      onMutateSuccess={() => {
        qc.invalidateQueries({ queryKey: ["testimonials"] });
      }}
    />
  );
};

export const AdminGallery = () => {
  const qc = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["admin-gallery-categories"],
    queryFn: () => apiGet<{ id: number; label: string; filter_key: string }[]>("/admin/gallery/categories").catch(() => []),
  });

  const { data: images, isLoading } = useQuery({
    queryKey: ["admin-gallery-images"],
    queryFn: () => apiGet<{ id: number; image_url: string; category: number }[]>("/admin/gallery").catch(() => []),
  });

  const [open, setOpen]                   = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile]         = useState<File | null>(null);
  const [catOpen, setCatOpen]             = useState(false);
  const [catLabel, setCatLabel]           = useState("");

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-gallery-images"] });
    qc.invalidateQueries({ queryKey: ["admin-gallery-categories"] });
    // also invalidate public gallery so frontend reflects change
    qc.invalidateQueries({ queryKey: ["gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery-cats"] });
  };

  const addImage = useMutation({
    mutationFn: () => {
      if (!imageFile) return Promise.reject("No image selected");
      const fd = new FormData();
      fd.append("image", imageFile);
      fd.append("category", selectedCategory);
      return apiPost("/admin/gallery", fd);
    },
    onSuccess: () => {
      toast.success("Image uploaded");
      setOpen(false);
      setImageFile(null);
      setSelectedCategory("");
      invalidateAll();
    },
    onError: () => toast.error("Upload failed"),
  });

  const addCategory = useMutation({
    mutationFn: () => apiPost("/admin/gallery/categories", {
      label: catLabel,
      filter_key: catLabel.toLowerCase().replace(/\s+/g, "_"),
    }),
    onSuccess: () => {
      toast.success("Category created");
      setCatOpen(false);
      setCatLabel("");
      invalidateAll();
    },
    onError: () => toast.error("Failed to create category"),
  });

  const removeImage = useMutation({
    mutationFn: (id: number) => apiDelete(`/admin/gallery/${id}`),
    onSuccess: () => {
      toast.success("Image deleted");
      invalidateAll();
    },
    onError: () => toast.error("Delete failed"),
  });

  const removeCategory = useMutation({
    mutationFn: (id: number) => apiDelete(`/admin/gallery/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      invalidateAll();
    },
    onError: () => toast.error("Delete failed"),
  });

  const getCategoryLabel = (id: number) =>
    categories?.find((c) => c.id === id)?.label ?? `#${id}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Gallery</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => setCatOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> New Category
          </Button>
          <Button className="rounded-full" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Upload Image
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Categories</h3>
        {!categories || categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet. Create one first before uploading images.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm font-medium border border-border">
                {c.label}
                <span className="text-muted-foreground text-xs ml-1">({c.filter_key})</span>
                <button
                  onClick={() => removeCategory.mutate(c.id)}
                  className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Images grid */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
          Images ({images?.length ?? 0})
        </h3>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !images || images.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square border border-border">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <span className="text-white text-xs font-medium text-center">{getCategoryLabel(img.category)}</span>
                  <Button size="sm" variant="destructive" onClick={() => removeImage.mutate(img.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>Select an image and assign it to a category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {imageFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
            <div>
              <Label>Category</Label>
              {!categories || categories.length === 0 ? (
                <p className="text-sm text-destructive mt-1">No categories yet. Close and create a category first.</p>
              ) : (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-1 border border-border rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.label}>{c.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => addImage.mutate()}
              disabled={addImage.isPending || !imageFile || !selectedCategory}
            >
              {addImage.isPending ? "Uploading…" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New category dialog */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
            <DialogDescription>Enter a name for the new gallery category.</DialogDescription>
          </DialogHeader>
          <div>
            <Label>Category name</Label>
            <Input
              value={catLabel}
              onChange={(e) => setCatLabel(e.target.value)}
              placeholder="e.g. Playing"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatOpen(false)}>Cancel</Button>
            <Button onClick={() => addCategory.mutate()} disabled={addCategory.isPending || !catLabel.trim()}>
              {addCategory.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AdminBlog = () => (
  <CrudResource
    title="Blog Posts"
    endpoint="/admin/blog/posts"
    fields={[
      { key: "title",          label: "Title"                           },
      { key: "excerpt",        label: "Excerpt",        type: "textarea" },
      { key: "content",        label: "Content (HTML)", type: "textarea" },
      { key: "featured_image", label: "Featured image", type: "image"    },
      { key: "author",         label: "Author"                          },
      { key: "category",       label: "Category"                        },
      { key: "tags",           label: "Tags (comma-separated)"          },
    ]}
    columns={[
      { key: "title",    label: "Title"    },
      { key: "author",   label: "Author"   },
      { key: "category", label: "Category" },
    ]}
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
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-about"] });
      // invalidate public about so frontend reflects change
      qc.invalidateQueries({ queryKey: ["about"] });
    },
    onError: () => toast.error("Save failed"),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-display font-bold">About Page Content</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <Label>Bullet points</Label>
          <div className="space-y-2 mt-1">
            {form.bullet_points.map((bp, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={bp}
                  onChange={(e) => {
                    const next = [...form.bullet_points];
                    next[i] = e.target.value;
                    setForm({ ...form, bullet_points: next });
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setForm({ ...form, bullet_points: form.bullet_points.filter((_, idx) => idx !== i) })}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForm({ ...form, bullet_points: [...form.bullet_points, ""] })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add bullet
            </Button>
          </div>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export const AdminSettings = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => apiGet<SiteSettings>("/admin/settings").catch(() => null),
  });
  const [form, setForm] = useState<SiteSettings>({ address: "", email: "", phone: "", opening_hours: "" });
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: () => apiPut("/admin/settings", form),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      // invalidate public site-settings so footer/contact reflects change
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: () => toast.error("Save failed"),
  });

  const fields: [keyof SiteSettings, string][] = [
    ["school_name",    "School name"   ],
    ["tagline",        "Tagline"       ],
    ["address",        "Address"       ],
    ["phone",          "Phone"         ],
    ["email",          "Email"         ],
    ["opening_hours",  "Opening hours" ],
    ["facebook",       "Facebook"      ],
    ["twitter",        "Twitter"       ],
    ["instagram",      "Instagram"     ],
    ["linkedin",       "LinkedIn"      ],
    ["whatsapp",       "WhatsApp"      ],
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-display font-bold">Site Settings</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {fields.map(([k, label]) => (
          <div key={k}>
            <Label>{label}</Label>
            <Input
              value={(form[k] as string) ?? ""}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          </div>
        ))}
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export const AdminMessages = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => apiGet<ContactMessage[]>("/admin/submissions/contact-messages").catch(() => [] as ContactMessage[]),
  });
  const toggle = useMutation({
    mutationFn: (id: number) => apiPatch(`/admin/submissions/messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Contact Messages</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr className="text-left">
              <th className="px-4 py-3">Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Read</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((m) => (
              <tr key={m.id} className="border-t border-border/50">
                <td className="px-4 py-3">{m.name}</td>
                <td>{m.email}</td>
                <td>{m.subject}</td>
                <td>{format(new Date(m.created_at), "MMM d, yyyy")}</td>
                <td>
                  <input type="checkbox" checked={m.is_read} onChange={() => toggle.mutate(m.id)} />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No messages yet.</td></tr>
            )}
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
    queryFn: () => apiGet<Booking[]>("/admin/submissions/bookings").catch(() => [] as Booking[]),
  });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiPatch(`/admin/submissions/bookings/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Bookings</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr className="text-left">
              <th className="px-4 py-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Class</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((b) => (
              <tr key={b.id} className="border-t border-border/50">
                <td className="px-4 py-3">{b.name}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>{b.class_title ?? `#${b.class_id}`}</td>
                <td>
                  <select
                    value={b.status}
                    onChange={(e) => update.mutate({ id: b.id, status: e.target.value })}
                    className="bg-background border border-border rounded px-2 py-1 text-xs"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td>{format(new Date(b.created_at), "MMM d, yyyy")}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminNewsletter = () => {
  const { data } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: () => apiGet<NewsletterSubscriber[]>("/admin/submissions/newsletter").catch(() => [] as NewsletterSubscriber[]),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Newsletter Subscribers</h2>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr className="text-left">
              <th className="px-4 py-3">Name</th>
              <th>Email</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id} className="border-t border-border/50">
                <td className="px-4 py-3">{s.name}</td>
                <td>{s.email}</td>
                <td>{format(new Date(s.created_at), "MMM d, yyyy")}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">No subscribers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};