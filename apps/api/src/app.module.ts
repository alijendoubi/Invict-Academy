import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from './notifications/notifications.module';
import { StudentsModule } from './students/students.module';
import { ApplicationsModule } from './applications/applications.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        LeadsModule,
        NotificationsModule,
        StudentsModule,
        ApplicationsModule,
        DocumentsModule,
    ],
})
export class AppModule { }
