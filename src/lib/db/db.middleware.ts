import { createMiddleware } from '@tanstack/react-start'
import { prisma } from './prisma'

export const dbMiddleware = createMiddleware({ type: 'function' }).server(
  ({ next }) => next({ context: { db: prisma } }),
)
