import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  // Account Info
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  // Patient Info
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email format"),
  gender: z
    .union([z.literal("Male"), z.literal("Female"), z.literal("Other")])
    .refine((val) => val !== undefined, {
      message: "Please select a gender",
    }),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  nationality: z.string().min(1, "Nationality is required"),
  placeOfResidence: z.string().min(1, "Place of residence is required"),
  address: z.string().min(1, "Address is required"),
});
