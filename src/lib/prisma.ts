import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client singleton instance
 * 
 * Creating multiple PrismaClient instances can lead to connection pool exhaustion.
 * This singleton pattern ensures only one instance is created and reused across the application.
 * 
 * In production, Prisma Client automatically manages connection pooling, but creating
 * multiple instances defeats this optimization.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

