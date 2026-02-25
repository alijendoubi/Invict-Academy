import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ConsultationsService } from "./consultations.service";
import { CreateConsultationDto } from "./dto/consultation.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("consultations")
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly service: ConsultationsService) {}

  @Post()
  create(@Body() dto: CreateConsultationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("student/:studentId")
  findByStudent(@Param("studentId") id: string) {
    return this.service.findByStudent(id);
  }
}
