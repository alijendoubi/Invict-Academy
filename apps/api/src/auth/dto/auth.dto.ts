import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@invict/db';

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ enum: Role, default: Role.STUDENT })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password!: string;
}
