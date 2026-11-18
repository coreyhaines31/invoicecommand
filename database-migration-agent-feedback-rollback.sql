-- Rollback: Agent feedback
-- Drops the agent_feedback table and its indexes. Deletes every stored report.

DROP TABLE IF EXISTS public.agent_feedback;
