import { z } from 'zod';

// Define a schema for the registration form
export const registrationSchema = z.object({
    full_name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    password2: z.string().min(1, 'Password (again) is required'),
    terms: z.boolean().refine(val => val, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const registerFields = [
    {
        name: "full_name",
        type: "text",
        placeholder: "Full name",
    },
    {
        name: "email",
        type: "email",
        placeholder: "Email address",
    },
    {
        name: "password",
        type: "password",
        placeholder: "Password",
    },
    {
        name: "password2",
        type: "password",
        placeholder: "Password (again)",
    }
];

export const usernameSchema = z.object({
    username: z.string().min(3, 'Username is required')
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username must contain only letters, numbers, and underscores" })
        .max(20, 'Username must be 3-20 characters')
});

export type UsernameFormValues = z.infer<typeof usernameSchema>;