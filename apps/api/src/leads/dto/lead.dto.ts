import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LeadStatus } from "@invict/db";

export class CreateLeadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  interestedDegree?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  interestedCountry?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  source?: string;
}

export class UpdateLeadDto {
  @ApiProperty({ required: false, enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  assignedToId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  score?: number;
}
