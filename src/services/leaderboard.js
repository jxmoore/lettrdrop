import { supabase } from './supabase';

/**
 * Submit a completed game score.
 * Inserts into game_scores and conditionally updates profiles.best_score.
 */
export async function submitScore(userId, { score, words }) {
  // Insert the game result
  const { error: insertErr } = await supabase
    .from('game_scores')
    .insert({ user_id: userId, score, words });
  if (insertErr) {
    console.error('[submitScore] insert failed:', insertErr.message);
    throw insertErr;
  }

  // Update best_score on profile if this is a new record.
  // Handle NULL (never played) and lower scores.
  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ best_score: score })
    .eq('id', userId)
    .or(`best_score.lt.${score},best_score.is.null`);
  if (updateErr) {
    console.error('[submitScore] profile update failed:', updateErr.message);
    throw updateErr;
  }
}

/**
 * Get the player's personal high scores (most recent games ranked by score).
 * Returns up to `limit` rows.
 */
export async function getPersonalScores(userId, limit = 20) {
  const { data, error } = await supabase
    .from('game_scores')
    .select('id, score, words, created_at')
    .eq('user_id', userId)
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

/**
 * Get the player's global rank based on profiles.best_score.
 * Returns { rank, total }.
 */
export async function getGlobalRank(userId) {
  // Get the player's best score
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('best_score')
    .eq('id', userId)
    .single();
  if (pErr) throw pErr;

  const myScore = profile.best_score || 0;

  // Count players with a higher best_score (rank = that count + 1)
  const { count: above, error: cErr } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('best_score', myScore);
  if (cErr) throw cErr;

  // Count total players who have played (best_score > 0)
  const { count: total, error: tErr } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('best_score', 0);
  if (tErr) throw tErr;

  return { rank: (above || 0) + 1, total: total || 0 };
}

/**
 * Get the ±1 neighbors around the player's rank on the global leaderboard.
 * Returns { myRank, total, rows: [{ rank, name, score, me }] }.
 *
 * Strategy: fetch the player's rank, then get the 3 rows around that position.
 */
export async function getAroundMe(userId) {
  const { rank, total } = await getGlobalRank(userId);

  // Get the player's own best score + name
  const { data: me, error: meErr } = await supabase
    .from('profiles')
    .select('display_name, best_score')
    .eq('id', userId)
    .single();
  if (meErr) throw meErr;

  const myScore = me.best_score || 0;
  const rows = [];

  // Row above: one player with best_score >= myScore who isn't me, ordered by score ASC (closest above)
  const { data: aboveRows } = await supabase
    .from('profiles')
    .select('display_name, best_score')
    .gt('best_score', myScore)
    .order('best_score', { ascending: true })
    .limit(1);

  if (aboveRows && aboveRows.length > 0) {
    rows.push({
      rank: rank - 1,
      name: aboveRows[0].display_name,
      score: aboveRows[0].best_score,
      me: false,
    });
  }

  // Me
  rows.push({
    rank,
    name: me.display_name,
    score: myScore,
    me: true,
  });

  // Row below: one player with best_score < myScore, ordered by score DESC (closest below)
  const { data: belowRows } = await supabase
    .from('profiles')
    .select('display_name, best_score')
    .lt('best_score', myScore)
    .gt('best_score', 0)
    .order('best_score', { ascending: false })
    .limit(1);

  if (belowRows && belowRows.length > 0) {
    rows.push({
      rank: rank + 1,
      name: belowRows[0].display_name,
      score: belowRows[0].best_score,
      me: false,
    });
  }

  return { myRank: rank, total, rows };
}

/**
 * Get profile stats for the Profile page.
 * Returns { mostWordsPerGame } by querying game_scores.
 */
export async function getProfileStats(userId) {
  const { data, error } = await supabase
    .from('game_scores')
    .select('words')
    .eq('user_id', userId)
    .order('words', { ascending: false })
    .limit(1);
  if (error) throw error;

  return {
    mostWordsPerGame: data && data.length > 0 ? data[0].words : 0,
  };
}
