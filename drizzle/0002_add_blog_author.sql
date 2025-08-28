-- Add author_id column to blog_posts table
ALTER TABLE "blog_posts" ADD COLUMN "author_id" varchar(255) REFERENCES "users"("id") ON DELETE SET NULL;

-- Add index for author_id
CREATE INDEX "blog_post_author_id_idx" ON "blog_posts"("author_id"); 