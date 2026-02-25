import { IsString, IsDateString, IsOptional } from "class-validator";

export class CreateConsultationDto {
  @IsString()
  studentId: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  whatsappPhone: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
