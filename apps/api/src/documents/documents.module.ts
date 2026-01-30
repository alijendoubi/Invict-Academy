import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [StorageModule],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
