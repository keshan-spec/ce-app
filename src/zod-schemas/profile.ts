import { z } from "zod";

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string()
        .min(8, { message: "New password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "New password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "New password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "New password must contain at least one number" })
        .regex(/[^a-zA-Z0-9]/, { message: "New password must contain at least one special character" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // set the path of the error to 'confirmPassword'
});

export type PasswordForm = z.infer<typeof passwordSchema>;

export const userDetailsSchema = z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
});

export type UserDetailsForm = z.infer<typeof userDetailsSchema>;

const usernamePattern = /^[a-zA-Z0-9._]+$/;
const urlPattern = /(https?:\/\/[^\s]+)/;

export const socialMediaSchema = z.object({
    instagram: z.string().optional()
        .refine((value) => !value || !urlPattern.test(value), {
            message: "Links are not allowed. Please enter only the username."
        })
        .refine((value) => !value || usernamePattern.test(value), {
            message: "Invalid username. Only letters, numbers, dots, and underscores are allowed."
        }),
    facebook: z.string().optional()
        .refine((value) => !value || !urlPattern.test(value), {
            message: "Links are not allowed. Please enter only the username."
        })
        .refine((value) => !value || usernamePattern.test(value), {
            message: "Invalid username. Only letters, numbers, dots, and underscores are allowed."
        }),
    tiktok: z.string().optional()
        .refine((value) => !value || !urlPattern.test(value), {
            message: "Links are not allowed. Please enter only the username."
        })
        .refine((value) => !value || usernamePattern.test(value), {
            message: "Invalid username. Only letters, numbers, dots, and underscores are allowed."
        }),
    youtube: z.string().optional()
        .refine((value) => !value || !urlPattern.test(value), {
            message: "Links are not allowed. Please enter only the username."
        })
        .refine((value) => !value || usernamePattern.test(value), {
            message: "Invalid username. Only letters, numbers, dots, and underscores are allowed."
        }),
    custodian: z.string().optional()
        .refine((value) => !value || !urlPattern.test(value), {
            message: "Links are not allowed. Please enter only the username."
        })
        .refine((value) => !value || usernamePattern.test(value), {
            message: "Invalid username. Only letters, numbers, dots, and underscores are allowed."
        }),
    mivia: z.string().optional()
        .refine((value) => !value || !urlPattern.test(value), {
            message: "Links are not allowed. Please enter only the username."
        })
        .refine((value) => !value || usernamePattern.test(value), {
            message: "Invalid username. Only letters, numbers, dots, and underscores are allowed."
        })
});

export type SocialMediaLinks = z.infer<typeof socialMediaSchema>;