import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { StudentStatus, ApplicationType, ApplicationStatus } from "@invict/db";

export class UpdateStudentDto {
  @ApiProperty({ enum: StudentStatus, required: false })
  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  passportNumber?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  passportExpiry?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parentName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parentPhone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class CreateApplicationDto {
  @ApiProperty({ enum: ApplicationType })
  @IsEnum(ApplicationType)
  type!: ApplicationType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  university?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  program?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  intakeTerm?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId!: string;
}

export class UpdateApplicationDto {
  @ApiProperty({ enum: ApplicationStatus, required: false })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;
}
