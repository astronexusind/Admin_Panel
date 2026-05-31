import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required."),
  price: z.coerce.number().min(0, "Price must be zero or more."),
  category: z.string().min(1, "Category is required."),
  astrologyType: z.string().min(1, "Astrology type is required."),
  stock: z.coerce.number().min(0, "Stock must be zero or more."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  images: z.array(z.unknown()).optional(),
  isActive: z.boolean(),
  deliveryType: z.string().min(1, "Delivery type is required.")
});

export const userSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(8, "Phone number is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.string().min(1, "Role is required.")
});

export const astrologyUserSchema = z
  .object({
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().min(8, "Phone number is required."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your password."),
    dateOfBirth: z.string().min(4, "Date of birth is required."),
    timeOfBirth: z.string().min(1, "Time of birth is required."),
    placeOfBirth: z.string().min(2, "Place of birth is required."),
    tempChartId: z.string().optional().or(z.literal(""))
  })
  .refine((vals) => vals.password === (vals as any).confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

export const orderStatusSchema = z.object({
  status: z.string().min(1, "Status is required.")
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required."),
  description: z.string().min(2, "Description is required.")
});

export const cmsSchema = z.object({
  type: z.string().min(1, "Content type is required."),
  title: z.string().min(2, "Title is required."),
  content: z.string().min(2, "Content is required."),
  image: z.string().url("Enter a valid image URL.").or(z.literal("")),
  isActive: z.boolean()
});

export const discountSchema = z.object({
  code: z.string().min(2, "Discount code is required."),
  percentage: z.coerce.number().min(1).max(100),
  expiry: z.string().min(1, "Expiry date is required.")
});

export const astrologyServiceSchema = z.object({
  name: z.string().min(2, "Name is required."),
  key: z.string().min(2, "Key is required."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  enabled: z.boolean(),
  isPremium: z.boolean()
});

export const passwordUpdateSchema = z
  .object({
    oldPassword: z.string().min(6, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your new password.")
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
export type AstrologyUserFormValues = z.infer<typeof astrologyUserSchema>;
export type OrderStatusFormValues = z.infer<typeof orderStatusSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type CmsFormValues = z.infer<typeof cmsSchema>;
export type DiscountFormValues = z.infer<typeof discountSchema>;
export type AstrologyServiceFormValues = z.infer<typeof astrologyServiceSchema>;
export type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>;
