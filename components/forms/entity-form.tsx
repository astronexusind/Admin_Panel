"use client";

import { useEffect, useMemo } from "react";
import { Controller, type DefaultValues, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?:
    | "text"
    | "number"
    | "textarea"
    | "select"
    | "switch"
    | "email"
    | "password"
    | "date"
    | "datetime-local"
    | "file";
  placeholder?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
};

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function FileInputControl({
  value,
  onChange,
  onBlur,
  accept,
  multiple
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  accept?: string;
  multiple?: boolean;
}) {
  const files = Array.isArray(value) ? value.filter(isFile) : [];

  const previews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      })),
    [files]
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews]
  );

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
          onChange(selectedFiles);
        }}
        onBlur={onBlur}
        className="flex h-11 w-full rounded-2xl border border-border bg-card/70 px-4 py-2 text-sm text-foreground file:mr-3 file:rounded-xl file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary"
      />

      {previews.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {previews.map((preview) => (
              <div key={preview.url} className="overflow-hidden rounded-xl border border-border bg-card">
                {preview.type.startsWith("image/") ? (
                  <img src={preview.url} alt={preview.name} className="h-20 w-full object-cover" />
                ) : (
                  <div className="flex h-20 items-center justify-center px-2 text-center text-xs text-muted">
                    {preview.name}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs font-medium text-rose-300 transition hover:text-rose-200"
          >
            Clear selected files
          </button>
        </>
      ) : null}
    </div>
  );
}

export function EntityForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitLabel,
  pending
}: {
  form: UseFormReturn<T>;
  fields: FormFieldConfig<T>[];
  onSubmit: (values: T) => void | Promise<void>;
  submitLabel: string;
  pending?: boolean;
}) {
  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <Controller
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: controllerField, fieldState }) => (
              <div className={field.type === "textarea" || field.type === "file" ? "md:col-span-2" : ""}>
                <label className="mb-2 block text-sm font-medium text-foreground">{field.label}</label>
                {field.type === "textarea" ? (
                  <Textarea
                    placeholder={field.placeholder}
                    value={String(controllerField.value ?? "")}
                    onChange={controllerField.onChange}
                    onBlur={controllerField.onBlur}
                  />
                ) : field.type === "file" ? (
                  <FileInputControl
                    value={controllerField.value}
                    onChange={controllerField.onChange}
                    onBlur={controllerField.onBlur}
                    accept={field.accept}
                    multiple={field.multiple}
                  />
                ) : field.type === "select" ? (
                  <Select value={String(controllerField.value ?? "")} onChange={controllerField.onChange}>
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : field.type === "switch" ? (
                  <div className="flex h-11 items-center justify-between rounded-2xl border border-border bg-card/70 px-4">
                    <span className="text-sm text-muted">{field.description ?? "Toggle setting"}</span>
                    <Switch checked={Boolean(controllerField.value)} onCheckedChange={controllerField.onChange} />
                  </div>
                ) : (
                  <Input
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    value={String(controllerField.value ?? "")}
                    onChange={controllerField.onChange}
                    onBlur={controllerField.onBlur}
                  />
                )}
                {field.description && field.type !== "switch" ? (
                  <p className="mt-2 text-xs text-muted">{field.description}</p>
                ) : null}
                {fieldState.error?.message ? (
                  <p className="mt-2 text-sm text-rose-300">{fieldState.error.message}</p>
                ) : null}
              </div>
            )}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export type EntityFormDefaultValues<T extends FieldValues> = DefaultValues<T>;
