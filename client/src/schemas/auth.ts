import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
