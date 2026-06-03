-- Run this in Supabase SQL Editor to create the game_scores table.

CREATE TABLE IF NOT EXISTS game_scores (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score      INTEGER NOT NULL DEFAULT 0,
  words      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for personal high scores (user's games ranked by score)
CREATE INDEX IF NOT EXISTS idx_game_scores_user_score
  ON game_scores (user_id, score DESC);

-- Index for chronological lookups
CREATE INDEX IF NOT EXISTS idx_game_scores_user_created
  ON game_scores (user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Players can read their own scores
CREATE POLICY "Users can read own scores"
  ON game_scores FOR SELECT
  USING (auth.uid() = user_id);

-- Players can insert their own scores
CREATE POLICY "Users can insert own scores"
  ON game_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No update or delete — scores are immutable
