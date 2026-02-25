import { IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateStudentMessageDto {
  @IsString()
  studentId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
