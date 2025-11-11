import {z} from "zod";

export const UpdateUserBasicInfoSchema = z.object({
    name: z.string().optional(),
    avatarUrl: z.url().optional(),
    
})

export const UpdateAuthSchema = z.object({
    oldPassword: z.string().min(8, "Password must have at least 8 characters").optional(),
    newPassword: z.string().min(8, "Password must have at least 8 characters").optional(),
})