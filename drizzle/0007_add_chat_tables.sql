-- Migration: Add chat system tables
-- Created at: 2025-08-11

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS "chat_sessions" (
  "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar(255) NOT NULL,
  "user_name" varchar(255) NOT NULL,
  "user_email" varchar(255),
  "user_agent" text,
  "ip_address" varchar(45),
  "status" varchar(50) NOT NULL DEFAULT 'active',
  "last_activity" timestamp NOT NULL DEFAULT now(),
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS "chat_messages" (
  "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" varchar(255) NOT NULL REFERENCES "chat_sessions"("id") ON DELETE CASCADE,
  "sender_type" varchar(50) NOT NULL,
  "sender_id" varchar(255) NOT NULL,
  "sender_name" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "message_type" varchar(50) NOT NULL DEFAULT 'text',
  "is_read" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create chat_typing_indicators table
CREATE TABLE IF NOT EXISTS "chat_typing_indicators" (
  "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" varchar(255) NOT NULL REFERENCES "chat_sessions"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL,
  "user_name" varchar(255) NOT NULL,
  "is_typing" boolean NOT NULL DEFAULT false,
  "last_typing" timestamp NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "chat_session_user_id_idx" ON "chat_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "chat_session_status_idx" ON "chat_sessions"("status");
CREATE INDEX IF NOT EXISTS "chat_message_session_id_idx" ON "chat_messages"("session_id");
CREATE INDEX IF NOT EXISTS "chat_message_sender_type_idx" ON "chat_messages"("sender_type");
CREATE INDEX IF NOT EXISTS "chat_message_created_at_idx" ON "chat_messages"("created_at");
CREATE INDEX IF NOT EXISTS "chat_typing_session_id_idx" ON "chat_typing_indicators"("session_id");
CREATE INDEX IF NOT EXISTS "chat_typing_user_id_idx" ON "chat_typing_indicators"("user_id");
