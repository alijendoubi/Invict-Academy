# Invict Academy - Backend Module Guide

This guide explains how to add new features, tables, and modules to the Invict Academy NestJS Backend. The architecture relies on **Prisma** for the database layer and **NestJS** for the API logic.

---

## Step 1: Update the Database Schema

Every new module usually needs a place to store data. 

1. Open `packages/db/prisma/schema.prisma`.
2. Add your new model. For example, to add an `Event` system:
   ```prisma
   model Event {
     id          String   @id @default(uuid())
     title       String
     date        DateTime
     description String?
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```
3. Open a terminal in `packages/db` and synchronize the database:
   ```bash
   npm run db:push
   npm run db:generate
   ```
   *Note: `db:push` instantly alters your Supabase database to match the schema. In full production, you will use `db:migrate` to create migration files.*

---

## Step 2: Generate the NestJS Module

The backend lives in `apps/api`. NestJS has a powerful CLI to scaffold boilerplate code.

1. Open a terminal in `apps/api`.
2. Run the CLI resource generator to create a full CRUD suite:
   ```bash
   npx nest g resource events
   ```
3. When prompted:
   - What transport layer do you use? **REST API**
   - Would you like to generate CRUD entry points? **Yes**

This command automatically creates an `events` folder with a Module, Controller, Service, and DTOs, and registers the new `EventsModule` inside `app.module.ts`.

---

## Step 3: Wire up Prisma to the Service

NestJS needs to talk to your new Prisma model. We use the shared `PrismaService` for this.

1. Open your newly generated `events.service.ts`.
2. Inject the `PrismaService` into the constructor:

   ```typescript
   import { Injectable } from '@nestjs/common';
   import { PrismaService } from '../prisma/prisma.service'; // Adjust path as needed
   import { CreateEventDto } from './dto/create-event.dto';

   @Injectable()
   export class EventsService {
     constructor(private prisma: PrismaService) {}

     async create(createEventDto: CreateEventDto) {
       return this.prisma.event.create({
         data: createEventDto,
       });
     }

     async findAll() {
       return this.prisma.event.findMany();
     }
     // ... implement findOne, update, remove
   }
   ```

---

## Step 4: Secure the Controller (Authentication)

By default, new endpoints are publicly accessible. If only logged-in users (like Admins) should access them, apply the JWT Auth Guard.

1. Open `events.controller.ts`.
2. Add the `@UseGuards` decorator:

   ```typescript
   import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
   import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
   import { EventsService } from './events.service';

   @Controller('events')
   @UseGuards(JwtAuthGuard) // Protects all routes in this controller
   export class EventsController {
     constructor(private readonly eventsService: EventsService) {}

     @Post()
     create(@Body() createEventDto: CreateEventDto) {
       return this.eventsService.create(createEventDto);
     }
     
     // ...
   }
   ```

---

## Step 5: Test via Swagger

Invict Academy uses Swagger for automatic API documentation. 

1. Ensure the NestJS server is running: `npm run dev --workspace=api`.
2. Go to [http://localhost:3001/api/docs](http://localhost:3001/api/docs).
3. Log in via the `/auth/login` endpoint to get your Bearer Token.
4. Click "Authorize" at the top of Swagger and paste your token.
5. You can now test your new `/events` endpoints directly from the browser!