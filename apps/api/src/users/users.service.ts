import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(dto: CreateUserDto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (exists) {
            throw new ConflictException('User already exists');
        }

        const password = dto.password || Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: dto.role,
                password: hashedPassword,
                studentProfile: dto.role === 'STUDENT' ? { create: {} } : undefined,
                associateProfile: dto.role === 'ASSOCIATE' ? { create: { referralCode: Math.random().toString(36).substring(7) } } : undefined,
            },
        });

        return { ...user, tempPassword: dto.password ? undefined : password };
    }

    async update(id: string, dto: UpdateUserDto) {
        await this.findOne(id);

        return this.prisma.user.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.user.delete({
            where: { id },
        });
    }
}
