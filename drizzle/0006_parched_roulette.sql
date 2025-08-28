ALTER TABLE "gallery" DROP CONSTRAINT "gallery_uploaded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "uploaded_by" DROP NOT NULL;