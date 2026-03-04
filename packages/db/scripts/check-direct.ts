import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DIRECT_URL || "postgresql://postgres.gntyvsvjfoiolloimfqg:InvictAcademy2025!@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"
            }
        }
    });

    try {
        const userRoles = await prisma.user.groupBy({
            by: ['role'],
            _count: { id: true }
        });
        console.log('USER_ROLES:', JSON.stringify(userRoles, null, 2));

        const studentProfiles = await prisma.studentProfile.count();
        console.log('STUDENT_PROFILES_COUNT:', studentProfiles);

        const firstStudents = await prisma.studentProfile.findMany({
            take: 5,
            include: { user: { select: { email: true, role: true } } }
        });
        console.log('FIRST_STUDENTS:', JSON.stringify(firstStudents, null, 2));

    } catch (err: any) {
        console.error('DIRECT_DB_ERROR:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
