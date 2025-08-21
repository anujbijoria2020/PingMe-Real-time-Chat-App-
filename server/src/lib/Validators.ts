import z from 'zod';

export const SignUpSchemaValidation = z.object({
  fullName: z.string()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  email: z
    .email("Invalid email address"),

  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[@$!%*?&#]/, "Password must contain at least one special character")
    .max(20, "Password cannot exceed 20 characters"),

  bio: z.string()
    .max(200, "Bio cannot exceed 200 characters")
    .optional()
});


export const LoginSchemaValidation = z.object({
      email: z
    .email("Invalid email address"),

  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password cannot exceed 20 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),

})