-- Migration: Add missing title column to blog_posts table
-- Created at: 2025-08-11

-- Add the missing title column
ALTER TABLE "blog_posts" ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Untitled Blog Post';

-- Update existing records to have proper titles based on slug
UPDATE "blog_posts" SET "title" = "slug" WHERE "title" = 'Untitled Blog Post';

-- Remove the default constraint after updating existing data
ALTER TABLE "blog_posts" ALTER COLUMN "title" DROP DEFAULT;
