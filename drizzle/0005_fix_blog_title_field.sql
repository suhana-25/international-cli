-- Migration: Fix blog_posts title field from varchar(255) to text
-- Created at: 2024-01-01

-- Alter the title column to text type to allow longer titles
ALTER TABLE "blog_posts" ALTER COLUMN "title" TYPE text;
