ALTER TYPE "payment_method" ADD VALUE 'COD';--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_author_id_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "blog_post_author_id_idx";--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "author_id";