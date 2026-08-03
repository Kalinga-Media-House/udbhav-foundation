import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function setCors() {
  const bucketName = process.env.R2_BUCKET_NAME;
  
  const params = {
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
          AllowedOrigins: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://udbhav.org',
            'https://*.udbhav.org',
            'https://udbhav-foundation.vercel.app',
            'https://*.udbhav-foundation.vercel.app'
          ],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  };

  try {
    const command = new PutBucketCorsCommand(params);
    const data = await s3Client.send(command);
    console.log('Successfully set CORS rules:', data);
  } catch (err) {
    console.error('Error setting CORS rules:', err);
  }
}

setCors();
