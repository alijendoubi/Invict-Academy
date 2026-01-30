import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { LeadStatus } from '@invict/db';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeadsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

    async create(dto: CreateLeadDto) {
        const lead = await this.prisma.lead.create({
            data: {
                ...dto,
                status: LeadStatus.NEW,
            },
        });

        await this.notificationsService.sendLeadWelcome(lead);
        await this.notificationsService.sendStaffNewLeadNotification(lead);

        return lead;
    }

    async findAll() {
        return this.prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                assignedTo: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                activities: true,
                tasks: true,
            },
        });

        if (!lead) {
            throw new NotFoundException('Lead not found');
        }

        return lead;
    }

    async update(id: string, dto: UpdateLeadDto) {
        await this.findOne(id);
        return this.prisma.lead.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.lead.delete({
            where: { id },
        });
    }
}
