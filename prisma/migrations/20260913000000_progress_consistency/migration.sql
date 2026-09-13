BEGIN;
-- After consolidation, counters must describe the current answers rather than
-- historical duplicate attempts. Completion flags and timestamps are preserved.
UPDATE "TaskProgress" p SET
  "acertos" = (SELECT COUNT(*)::integer FROM "AnswerAttempt" a WHERE a."taskProgressId" = p."id" AND a."isCorrect"),
  "erros" = (SELECT COUNT(*)::integer FROM "AnswerAttempt" a WHERE a."taskProgressId" = p."id" AND NOT a."isCorrect");
COMMIT;
