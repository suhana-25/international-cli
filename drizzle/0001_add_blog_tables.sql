-- Migration: Add blog tables
-- Created at: 2024-01-01

-- Create blogPosts table
CREATE TABLE IF NOT EXISTS "blogPosts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"featuredImage" text,
	"authorId" uuid NOT NULL,
	"isPublished" boolean DEFAULT false NOT NULL,
	"allowComments" boolean DEFAULT true NOT NULL,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create blogComments table
CREATE TABLE IF NOT EXISTS "blogComments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"postId" uuid NOT NULL,
	"authorName" text NOT NULL,
	"authorEmail" text NOT NULL,
	"content" text NOT NULL,
	"isApproved" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "blog_post_slug_idx" ON "blogPosts" ("slug");

-- Add foreign key constraints
ALTER TABLE "blogPosts" ADD CONSTRAINT "blogPosts_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "blogComments" ADD CONSTRAINT "blogComments_postId_blogPosts_id_fk" FOREIGN KEY ("postId") REFERENCES "blogPosts"("id") ON DELETE cascade ON UPDATE no action; 