// DEMO MODE: Using mock database instead of real Prisma
// To restore real database, uncomment the code below and remove the mock import

/*
import { PrismaClient } from '@invict/db';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
*/

// Mock database for demo mode
import { mockPrisma } from './mock-db';

export const prisma = mockPrisma as any;
