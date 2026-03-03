import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ─── Super Admin ─────────────────────────────────────────────
    const adminEmail = 'admin@invictacademy.com';
    const adminPassword = 'InvictAdmin2025!';

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existingAdmin) {
        console.log(`✅ Admin already exists: ${adminEmail}`);
    } else {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashed,
                firstName: 'Super',
                lastName: 'Admin',
                role: Role.SUPER_ADMIN,
            },
        });
        console.log(`✅ Created admin: ${adminEmail} / ${adminPassword}`);
    }

    // ─── Staff user ──────────────────────────────────────────────
    const staffEmail = 'staff@invictacademy.com';
    const staffPassword = 'InvictStaff2025!';

    const existingStaff = await prisma.user.findUnique({ where: { email: staffEmail } });

    if (existingStaff) {
        console.log(`✅ Staff already exists: ${staffEmail}`);
    } else {
        const hashed = await bcrypt.hash(staffPassword, 10);
        await prisma.user.create({
            data: {
                email: staffEmail,
                password: hashed,
                firstName: 'Staff',
                lastName: 'Member',
                role: Role.STAFF,
            },
        });
        console.log(`✅ Created staff: ${staffEmail} / ${staffPassword}`);
    }

    // ─── Demo Student ─────────────────────────────────────────────
    const studentEmail = 'student@invictacademy.com';
    const studentPassword = 'InvictStudent2025!';

    const existingStudent = await prisma.user.findUnique({ where: { email: studentEmail } });

    if (existingStudent) {
        console.log(`✅ Student already exists: ${studentEmail}`);
    } else {
        const hashed = await bcrypt.hash(studentPassword, 10);
        await prisma.user.create({
            data: {
                email: studentEmail,
                password: hashed,
                firstName: 'Demo',
                lastName: 'Student',
                role: Role.STUDENT,
                studentProfile: { create: {} },
            },
        });
        console.log(`✅ Created student: ${studentEmail} / ${studentPassword}`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log('─'.repeat(50));
    console.log('Admin:   admin@invictacademy.com / InvictAdmin2025!');
    console.log('Staff:   staff@invictacademy.com / InvictStaff2025!');
    console.log('Student: student@invictacademy.com / InvictStudent2025!');
    console.log('─'.repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
