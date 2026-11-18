import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid.'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi.')
    .max(128, 'Kata sandi terlalu panjang.'),
})
export type LoginInput = z.infer<typeof loginSchema>
