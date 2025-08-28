CREATE TABLE IF NOT EXISTS "content" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"page" varchar(100) NOT NULL,
	"title" varchar(255),
	"content" text,
	"meta_description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_page_unique" UNIQUE("page")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"order_id" varchar(255) NOT NULL,
	"product_id" varchar(255) NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"price" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "about_info";--> statement-breakpoint
DROP TABLE "accounts";--> statement-breakpoint
DROP TABLE "sessions";--> statement-breakpoint
DROP TABLE "verification_tokens";--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_session_cart_id_unique";--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_categories_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "cart_session_cart_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "review_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_idx";--> statement-breakpoint
ALTER TABLE "blog_posts" ALTER COLUMN "published_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blog_posts" ALTER COLUMN "published_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "carts" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "payment_method" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "comment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "payment_method" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "blog_comments" ADD COLUMN "status" varchar(50) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "author_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "status" varchar(50) DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "carts" ADD COLUMN "product_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "carts" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_number" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "total_amount" real NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "banner_images" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_banner" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "user_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "is_approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" varchar(255);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_item_order_id_idx" ON "order_items" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_item_product_id_idx" ON "order_items" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_post_author_id_idx" ON "blog_posts" ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart_product_id_idx" ON "carts" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_number_idx" ON "orders" ("order_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_featured_idx" ON "products" ("is_featured");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_banner_idx" ON "products" ("is_banner");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "review_is_approved_idx" ON "reviews" ("is_approved");--> statement-breakpoint
ALTER TABLE "blog_comments" DROP COLUMN IF EXISTS "is_approved";--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "is_published";--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "allow_comments";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "session_cart_id";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "items";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "items_price";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "shipping_price";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "tax_price";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "total_price";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "items";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "items_price";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_price";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "tax_price";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "total_price";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_number_unique" UNIQUE("order_number");