import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@invict/db';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @ApiOperation({ summary: 'Create a new user (Admin only)' })
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get()
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @ApiOperation({ summary: 'List all users' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @ApiOperation({ summary: 'Get user by ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @ApiOperation({ summary: 'Update user' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete user' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
