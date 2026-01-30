import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get("S3_BUCKET") || "invict-academy";
    this.s3 = new S3Client({
      region: this.config.get("S3_REGION") || "us-east-1",
      endpoint: this.config.get("S3_ENDPOINT") || "http://localhost:9000",
      credentials: {
        accessKeyId: this.config.get("S3_ACCESS_KEY") || "minioadmin",
        secretAccessKey: this.config.get("S3_SECRET_KEY") || "minioadmin",
      },
      forcePathStyle: true,
    });
  }

  async getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  async getDownloadUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }
}
