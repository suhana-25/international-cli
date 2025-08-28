CREATE TABLE IF NOT EXISTS "chat_messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"sender_type" varchar(50) NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"sender_name" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"message_type" varchar(50) DEFAULT 'text' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_email" varchar(255),
	"user_agent" text,
	"ip_address" varchar(45),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"last_seen" timestamp,
	"is_online" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_typing_indicators" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"is_typing" boolean DEFAULT false NOT NULL,
	"last_typing" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gallery" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"description" text,
	"image_url" varchar(500) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer,
	"mime_type" varchar(100),
	"uploaded_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_typing_indicators" ADD CONSTRAINT "chat_typing_indicators_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gallery" ADD CONSTRAINT "gallery_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_message_session_id_idx" ON "chat_messages" ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_message_sender_type_idx" ON "chat_messages" ("sender_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_message_created_at_idx" ON "chat_messages" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_session_user_id_idx" ON "chat_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_session_status_idx" ON "chat_sessions" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_session_is_online_idx" ON "chat_sessions" ("is_online");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_typing_session_id_idx" ON "chat_typing_indicators" ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_typing_user_id_idx" ON "chat_typing_indicators" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_uploaded_by_idx" ON "gallery" ("uploaded_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_created_at_idx" ON "gallery" ("created_at");