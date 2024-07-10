import { z } from "zod";

export const userSchema = z.object({
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    // email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    address_1: z.string().min(1, { message: 'Address is required' }),
    address_2: z.string().optional(),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    postcode: z.string().min(1, { message: 'Postcode is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
});

export type UserSchema = z.infer<typeof userSchema>;
