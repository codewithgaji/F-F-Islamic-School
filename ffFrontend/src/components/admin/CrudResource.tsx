import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

export type FieldType = "text" | "textarea" | "number" | "image";
export interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
}

interface Props<T extends { id: number }> {
  title: string;
  endpoint: string;
  publicEndpoint?: string;
  fields: FieldDef[];
  columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[];
}

export function CrudResource<T extends { id: number; [k: string]: unknown }>({
  title,
  endpoint,
  publicEndpoint,
  fields,
  columns,
}: Props<T>) {
  const qc = useQueryClient();
  const listKey = ["admin-list", endpoint];

  const { data, isLoading } = useQuery({
    queryKey: listKey,
    queryFn: () => apiGet<T[]>(publicEndpoint ?? endpoint).catch(() => [] as T[]),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const save = useMutation({
    mutationFn: () => {
      const hasFileField = fields.some((f) => f.type === "image");

      if (hasFileField) {
        // On create, all image fields are required
        if (!editing) {
          const missingImages = fields
            .filter((f) => f.type === "image")
            .filter((f) => !(form[f.key] instanceof File));
          if (missingImages.length > 0) {
            toast.error(`Please select an image for: ${missingImages.map((f) => f.label).join(", ")}`);
            return Promise.resolve(undefined);
          }
        }

        const fd = new FormData();
        for (const [key, value] of Object.entries(form)) {
          if (value instanceof File) {
            fd.append(key, value);
          } else if (value !== null && value !== undefined) {
            fd.append(key, String(value));
          }
        }
        console.log("FormData entries:");
        for (const [key, value] of fd.entries()) {
          console.log(" ", key, "→", value);
        }
        return editing
          ? apiPut(`${endpoint}/${editing.id}`, fd)
          : apiPost(endpoint, fd);
      }

      // No file fields — send as JSON
      return editing
        ? apiPut(`${endpoint}/${editing.id}`, form)
        : apiPost(endpoint, form);
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: listKey });
    },
    onError: () => toast.error("Save failed"),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiDelete(`${endpoint}/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: listKey });
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">{title}</h2>
        <Button onClick={openCreate} className="rounded-full">
          <Plus className="w-4 h-4 mr-1" /> New
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-foreground">
              <tr className="text-left">
                {columns.map((c) => (
                  <th key={String(c.key)} className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : (data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                    No records yet.
                  </td>
                </tr>
              ) : (
                (data ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-border/50">
                    {columns.map((c) => (
                      <td key={String(c.key)} className="px-4 py-3">
                        {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove.mutate(row.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `New ${title}`}</DialogTitle>
            <DialogDescription>
              {editing ? `Update the details for this ${title}.` : `Fill in the details to create a new ${title}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.key}
                    rows={4}
                    value={(form[f.key] as string) ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                ) : f.type === "image" ? (
                  <div className="space-y-1">
                    <Input
                      id={f.key}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.files?.[0] ?? null }))}
                    />
                    {/* Show current image URL when editing and no new file picked */}
                    {editing && typeof form[f.key] === "string" && (
                      <p className="text-xs text-muted-foreground truncate">
                        Current: {form[f.key] as string}
                      </p>
                    )}
                  </div>
                ) : (
                  <Input
                    id={f.key}
                    type={f.type === "number" ? "number" : "text"}
                    value={(form[f.key] as string) ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={save.isPending}>
              Cancel
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}