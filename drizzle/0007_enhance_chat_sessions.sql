-- Add enhanced user activity tracking fields to chat_sessions table
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for online status
CREATE INDEX IF NOT EXISTS chat_session_is_online_idx ON chat_sessions(is_online);

-- Update existing sessions to have online status
UPDATE chat_sessions 
SET is_online = CASE 
  WHEN status = 'active' THEN TRUE 
  ELSE FALSE 
END,
last_seen = last_activity
WHERE last_seen IS NULL;
