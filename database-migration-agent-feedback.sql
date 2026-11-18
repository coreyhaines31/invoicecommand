-- Migration: Agent feedback
-- Stores reports filed by AI agents through the MCP server's submit_feedback
-- tool (POST /api/v1/feedback). Text is scrubbed of secrets and emails before
-- insert. Rows carry user and API key IDs only. Rollback:
-- database-migration-agent-feedback-rollback.sql

CREATE TABLE IF NOT EXISTS public.agent_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  api_key_id TEXT REFERENCES public.api_keys(id) ON DELETE SET NULL,
  client TEXT,
  task TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('missing', 'broken', 'confusing', 'idea')),
  impact TEXT NOT NULL CHECK (impact IN ('blocked', 'worked_around', 'friction')),
  tool_name TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'closed')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS agent_feedback_user_idx ON public.agent_feedback (user_id);
CREATE INDEX IF NOT EXISTS agent_feedback_api_key_idx ON public.agent_feedback (api_key_id);
CREATE INDEX IF NOT EXISTS agent_feedback_created_idx ON public.agent_feedback (created_at);
CREATE INDEX IF NOT EXISTS agent_feedback_status_created_idx ON public.agent_feedback (status, created_at);
