import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(6, "Invalid phone number"),
  gender: z.enum(["male", "female", "other"]).refine(val => val, {
    message: "Please select a gender"
    }),
  profilePicture: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size < 5 * 1024 * 1024, "File must be less than 5MB"),
})


export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
