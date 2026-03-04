import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

async function test() {
    console.log("Testing S3 Connection...");
    try {
        const s3Bucket = "invict-academy-docs";
        const s3 = new S3Client({
            region: "eu-north-1",
            endpoint: "https://gntyvsvjfoiolloimfqg.storage.supabase.co/storage/v1/s3",
            credentials: {
                accessKeyId: "66655b01b38be8910498b60fba203ef9",
                secretAccessKey: "07d790357bfc541fe5fc7c5e09a551247762685add0c6d9c32842bca8410622d",
            },
            forcePathStyle: true,
        });

        const key = `test/test-${randomUUID()}.txt`;
        const buffer = Buffer.from("Hello from test script!");

        console.log(`Uploading to bucket ${s3Bucket} at ${key}...`);

        await s3.send(
            new PutObjectCommand({
                Bucket: s3Bucket,
                Key: key,
                Body: buffer,
                ContentType: "text/plain",
            })
        );
        console.log("✅ Upload successful!");
    } catch (err) {
        console.error("❌ Upload failed:", err);
    }
}
test();
