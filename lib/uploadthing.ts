import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'

import type { OurFileRouter } from '@/app/api/uploadthing/core'

// Configure UploadThing with proper environment variables
const uploadThingConfig = {
  url: typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  region: process.env.NEXT_PUBLIC_UPLOADTHING_REGION || 'us-east-1',
}

// Validate configuration
if (!process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID) {
  console.error('❌ NEXT_PUBLIC_UPLOADTHING_APP_ID is missing! Image uploads will not work.');
}

export const UploadButton = generateUploadButton<OurFileRouter>(uploadThingConfig)
export const UploadDropzone = generateUploadDropzone<OurFileRouter>(uploadThingConfig)