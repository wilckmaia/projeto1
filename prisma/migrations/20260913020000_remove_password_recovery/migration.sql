-- AuthChallenge is shared with optional email verification.
-- Remove only obsolete recovery records; preserve all users and sessions.
DELETE FROM "AuthChallenge" WHERE "kind" = 'reset';
