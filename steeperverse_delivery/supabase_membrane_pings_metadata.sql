-- Sage as Point Guard :: gives the existing SAGE_INQUIRY ping a payload.
--
-- membrane_pings.action_type already carries 'SAGE_INQUIRY' (broadcast from
-- handleAskSage in App.jsx whenever a Circle-enrolled visitor asks Sage anything),
-- but the table has never had a column to hold *what* was asked. This adds one,
-- nullable and defaulted so every existing row and every existing call site
-- (broadcastPing(actionType) with no second argument) keeps working unchanged.
--
-- Once this is applied, new SAGE_INQUIRY pings carry:
--   { "query_text": "<what the visitor typed>", "matched_topic": "<site-knowledge topic, or null>" }
-- Every other action_type's pings keep inserting an empty object, same as today's implicit shape.

ALTER TABLE membrane_pings
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
