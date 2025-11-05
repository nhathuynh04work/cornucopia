import {z} from "zod";

export const UpdateUserBasicInfoSchema = z.object({
    name: z.string().optional(),
    avatarUrl: z.url().optional(),
    
})

export const UpdateAuthSchema = z.object({
    password: z.string().min(8, "Password must have at least 8 characters").optional(),
})