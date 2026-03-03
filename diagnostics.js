const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function testUpload() {
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

    try {
        console.log("Attempting to upload missing test file...");
        const result = await s3.send(
            new PutObjectCommand({
                Bucket: s3Bucket,
                Key: "test/diagnostics.txt",
                Body: Buffer.from("Hello from Invict Academy diagnostics"),
                ContentType: "text/plain",
            })
        );
        console.log("Upload Success!", result);
    } catch (err) {
        console.error("Upload Failed:", err);
    }
}

testUpload();
