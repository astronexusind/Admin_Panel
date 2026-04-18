"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { type z } from "zod";

import { EntityForm, type EntityFormDefaultValues, type FormFieldConfig } from "@/components/forms/entity-form";
import { Modal } from "@/components/ui/modal";

export function FormModal<TSchema extends z.ZodType<FieldValues>>({
  open,
  onClose,
  title,
  description,
  schema,
  defaultValues,
  fields,
  extraContent,
  submitLabel,
  pending,
  onSubmit,
  size
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  schema: TSchema;
  defaultValues: EntityFormDefaultValues<z.infer<TSchema>>;
  fields: FormFieldConfig<z.infer<TSchema>>[];
  extraContent?: React.ReactNode;
  submitLabel: string;
  pending?: boolean;
  onSubmit: (values: z.infer<TSchema>) => void | Promise<void>;
  size?: "md" | "lg" | "xl";
}) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  const handleSubmit = async (values: z.infer<TSchema>) => {
    await onSubmit(values);
  };

  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size={size}>
      {extraContent}
      <EntityForm form={form} fields={fields} onSubmit={handleSubmit} submitLabel={submitLabel} pending={pending} />
    </Modal>
  );
}
