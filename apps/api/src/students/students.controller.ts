import { Controller, Get, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/student.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@invict/db';

@ApiTags('Students')
@Controller('students')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Get()
    @Roles(Role.ADMIN, Role.STAFF, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'List all students' })
    findAll() {
        return this.studentsService.findAll();
    }

    @Get('me')
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Get my profile' })
    findMe(@Req() req) {
        return this.studentsService.findByUserId(req.user.id);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.STAFF, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Get student details' })
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.STAFF, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update student profile' })
    update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
        return this.studentsService.update(id, dto);
    }
}
