import { createUploadthing, type FileRouter } from "uploadthing/next";

// Check for required environment variables
const uploadThingSecret = process.env.UPLOADTHING_SECRET;
const uploadThingAppId = process.env.UPLOADTHING_APP_ID;

if (!uploadThingSecret) {
  console.error('❌ UPLOADTHING_SECRET is missing! Please set this environment variable.');
}

if (!uploadThingAppId) {
  console.error('❌ UPLOADTHING_APP_ID is missing! Please set this environment variable.');
}

const f = createUploadthing();

export const ourFileRouter = {
  galleryImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = null // Skip auth check - using custom auth system
      // if (!// session?.user || "admin".role !== 'admin') {
      //   throw new Error('Unauthorized');
      // }
      return { userId: "admin", mediaType: "image" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
        mediaType: metadata.mediaType,
      };
    }),
  
  galleryVideo: f({
    video: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = null // Skip auth check - using custom auth system
      // if (!// session?.user || "admin".role !== 'admin') {
      //   throw new Error('Unauthorized');
      // }
      return { userId: "admin", mediaType: "video" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
        mediaType: metadata.mediaType,
      };
    }),

  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      const session = null // Skip auth check - using custom auth system
      return { userId: "admin", mediaType: "image" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
        mediaType: metadata.mediaType,
      };
    }),

  bannerImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const session = null // Skip auth check - using custom auth system
      return { userId: "admin", mediaType: "image" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
        mediaType: metadata.mediaType,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

