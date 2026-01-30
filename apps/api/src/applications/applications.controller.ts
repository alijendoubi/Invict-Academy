import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from "../students/dto/student.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "@invict/db";

@ApiTags("Applications")
@Controller("applications")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF) // Only staff creates apps for now
  @ApiOperation({ summary: "Create application" })
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: "List all applications" })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.STAFF, Role.STUDENT)
  @ApiOperation({ summary: "Get application details" })
  findOne(@Param("id") id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: "Update application status" })
  update(@Param("id") id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }
}
