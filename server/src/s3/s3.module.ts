import { Global, Module } from "@nestjs/common";

import { S3Client } from "@aws-sdk/client-s3";

@Global()
@Module({
  providers: [
    {
      provide: S3Client,
      useFactory: () =>
        new S3Client({
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          },
          region: process.env.S3_REGION || "local",
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: true,
        }),
    },
  ],
  exports: [S3Client],
})
export class S3Module {}
