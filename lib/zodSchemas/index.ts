import { z } from "zod";


export const SignUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    full_name: z.string().min(1, { message: "Full name is required" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Specify the field to show the error for
    message: "Passwords must match",
  });


export const SignInSchema = z.object({
  username: z.string(),
  password: z.string()
})
export type SignUp = z.infer<typeof SignUpSchema>;
export type SignInType = z.infer<typeof SignInSchema>;

