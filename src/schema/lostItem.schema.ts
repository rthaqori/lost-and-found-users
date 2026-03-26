// import { z } from "zod";

// // Categories enum
// export const categories = [
//   "Electronics",
//   "Clothing",
//   "Books",
//   "Accessories",
//   "Documents",
//   "Keys",
//   "Wallets",
//   "Bags",
//   "Mobile Phones",
//   "Laptops",
//   "ID Cards",
//   "Other",
// ] as const;

// export type Category = (typeof categories)[number];

// // Contact Info Schema
// export const contactInfoSchema = z
//   .object({
//     phone: z
//       .string()
//       .regex(/^[0-9+\-\s()]{10,15}$/, {
//         message: "Phone must be 10–15 digits and can include + - ()",
//       })
//       .or(z.literal(""))
//       .optional(),

//     email: z
//       .string()
//       .email({ message: "Invalid email format" })
//       .or(z.literal(""))
//       .optional(),

//     preferredContact: z
//       .enum(["phone", "email", "both"], {
//         message: "Select a valid contact preference",
//       })
//       .default("both"),

//     showContact: z
//       .boolean({
//         message: "Show contact must be true or false",
//       })
//       .default(true),
//   })
//   .optional();

// // Specific Location Schema
// export const specificLocationSchema = z
//   .object({
//     building: z.string().optional(),

//     floor: z.preprocess(
//       (val) => (val === "" || val === null ? undefined : val),
//       z
//         .number({
//           message: "Floor must be a number",
//         })
//         .min(-10, { message: "Floor cannot be less than -10" })
//         .max(100, { message: "Floor cannot be greater than 100" })
//         .optional(),
//     ),

//     room: z.string().optional(),
//     landmark: z.string().optional(),

//     coordinates: z
//       .tuple([
//         z.number({ message: "Latitude must be a number" }),
//         z.number({ message: "Longitude must be a number" }),
//       ])
//       .optional(),
//   })
//   .optional();

// // Image File Schema
// export const imageFileSchema = z
//   .instanceof(File, { message: "Image file is required" })
//   .refine((file) => file.size <= 5 * 1024 * 1024, {
//     message: "Image must be less than 5MB",
//   })
//   .refine(
//     (file) =>
//       [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/gif",
//         "image/webp",
//       ].includes(file.type),
//     {
//       message: "Only JPEG, JPG, PNG, GIF, and WEBP formats are allowed",
//     },
//   );

// // Create Schema
// export const createLostItemSchema = z.object({
//   itemName: z
//     .string({
//       message: "Item name is required",
//     })
//     .min(1, { message: "Item name cannot be empty" })
//     .max(100, { message: "Item name cannot exceed 100 characters" })
//     .trim(),

//   description: z
//     .string({
//       message: "Description is required",
//     })
//     .min(1, { message: "Description cannot be empty" })
//     .max(2000, { message: "Description cannot exceed 2000 characters" })
//     .trim(),

//   category: z.enum(categories, {
//     message: "Please select a valid category",
//   }),

//   subCategory: z.string().optional(),

//   status: z
//     .enum(["lost", "found"], { message: "Status must be either lost or found" })
//     .default("lost"),

//   locationDescription: z
//     .string({
//       message: "Location description is required",
//     })
//     .min(1, { message: "Location description cannot be empty" })
//     .trim(),

//   zoneId: z.string().optional(),

//   specificLocation: specificLocationSchema,

//   dateLost: z.string().optional(),
//   dateFound: z.string().optional(),

//   contactInfo: contactInfoSchema,

//   tags: z
//     .array(z.string({ message: "Each tag must be a string" }), {
//       message: "Tags must be an array of strings",
//     })
//     .default([]),

//   images: z
//     .array(z.union([imageFileSchema, z.string()]), {
//       message: "Images must be an array",
//     })
//     .min(1, { message: "At least one image is required" })
//     .max(5, { message: "You can upload up to 5 images only" }),
// });

// // Update Schema
// export const updateLostItemSchema = createLostItemSchema.partial();

// // Types
// export type CreateLostItemInput = z.infer<typeof createLostItemSchema>;
// export type UpdateLostItemInput = z.infer<typeof updateLostItemSchema>;

import { z } from "zod";

// Categories enum
export const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Accessories",
  "Documents",
  "Keys",
  "Wallets",
  "Bags",
  "Mobile Phones",
  "Laptops",
  "ID Cards",
  "Other",
] as const;

export type Category = (typeof categories)[number];

// Contact Info Schema
export const contactInfoSchema = z.object({
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{10,15}$/, {
      message: "Phone must be 10–15 digits and can include + - ()",
    })
    .optional()
    .nullable(),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .optional()
    .nullable(),
  preferredContact: z.enum(["phone", "email", "both"]).default("both"),
  showContact: z.boolean().default(true),
});

// Specific Location Schema
export const specificLocationSchema = z.object({
  building: z.string().optional().nullable(),
  floor: z
    .number()
    .min(-10, { message: "Floor cannot be less than -10" })
    .max(100, { message: "Floor cannot be greater than 100" })
    .optional()
    .nullable(),
  room: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  coordinates: z.tuple([z.number(), z.number()]).optional().nullable(),
});

// Create Schema
export const createLostItemSchema = z.object({
  itemName: z
    .string()
    .min(1, { message: "Item name is required" })
    .max(100, { message: "Item name cannot exceed 100 characters" })
    .trim(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(2000, { message: "Description cannot exceed 2000 characters" })
    .trim(),
  category: z.enum(categories, {
    message: "Please select a valid category",
  }),
  subCategory: z.string().optional().nullable(),
  status: z.enum(["lost", "found"]).default("lost"),
  locationDescription: z
    .string()
    .min(1, { message: "Location description is required" })
    .trim(),
  zoneId: z.string().optional().nullable(),
  specificLocation: specificLocationSchema.optional().nullable(),
  dateLost: z.string().optional().nullable(),
  dateFound: z.string().optional().nullable(),
  contactInfo: contactInfoSchema.optional(),
  tags: z.array(z.string()).default([]),
});

// Update Schema (all fields optional)
export const updateLostItemSchema = createLostItemSchema.partial();

// Types
export type CreateLostItemInput = z.infer<typeof createLostItemSchema>;
export type UpdateLostItemInput = z.infer<typeof updateLostItemSchema>;
