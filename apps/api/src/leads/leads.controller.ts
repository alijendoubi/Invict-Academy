import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { CreateLeadDto, UpdateLeadDto } from "./dto/lead.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "@invict/db";

@ApiTags("Leads")
@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new lead (Public)" })
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.STAFF, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "List all leads" })
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.STAFF, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Get lead details" })
  findOne(@Param("id") id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.STAFF, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Update lead" })
  update(@Param("id") id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }
}
