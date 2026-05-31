/* LettrDrop feature mockups — design-canvas mount. */
const { DesignCanvas, DCSection, DCArtboard } = window;
const W = 430, H = 880;

function FeaturesApp() {
  return (
    <DesignCanvas>
      <DCSection
        id="tutorial"
        title="First-time tutorial · How to Play"
        subtitle="Shown the first time a new player taps New Game (and re-openable from the menu). A quick swipeable sequence — each step plays a looping mini-animation: forming a word (and the grace window — extend it for more points), steering the tile, Swap, and Jumble — then drops them straight into their first game. Skip is always available."
      >
        <DCArtboard id="tut-welcome" label="Cover · Welcome" width={W} height={H}><window.TutoWelcome /></DCArtboard>
        <DCArtboard id="tut-match" label="1 · Spell a word (throb → extend → clear)" width={W} height={H}><window.TutoMatch /></DCArtboard>
        <DCArtboard id="tut-control" label="2 · Steer the tile" width={W} height={H}><window.TutoControl /></DCArtboard>
        <DCArtboard id="tut-swap" label="3 · Swap" width={W} height={H}><window.TutoSwapHow /></DCArtboard>
        <DCArtboard id="tut-jumble" label="4 · Jumble" width={W} height={H}><window.TutoJumbleHow /></DCArtboard>
      </DCSection>

      <DCSection
        id="board"
        title="In-game · the falling board"
        subtitle="Letters drop from the top; the player slides the live tile (white ring) into place. The landing footprint glows and NEXT shows the upcoming three. When the pile climbs dangerously high the letters start rocking back and forth as a warning. Any valid word in a row or column clears automatically."
      >
        <DCArtboard id="ig-default" label="A · Mid-game (live tile + next)" width={W} height={H}><window.IGDefault /></DCArtboard>
        <DCArtboard id="ig-forming" label="B · A word about to land (STARE)" width={W} height={H}><window.IGForming /></DCArtboard>
        <DCArtboard id="ig-danger" label="C · Stack near the top (letters rocking)" width={W} height={H}><window.IGDanger /></DCArtboard>
        <DCArtboard id="ig-paused" label="D · Paused" width={W} height={H}><window.Paused /></DCArtboard>
      </DCSection>

      <DCSection
        id="clear"
        title="Word cleared · grace window → pop & sparkle ✓"
        subtitle="A valid word doesn't vanish on contact — it THROBS for ~1.5s first (a depleting bar shows the timer) so the player can extend it. Drop a letter and the word grows, the timer resets, and only the longest version clears: pop, confetti, then the stack drops into the gap. Both loop so you can feel the timing."
      >
        <DCArtboard id="clear-pending" label="A · Pending clear (throb → STAR grows to STARE)" width={W} height={H}><window.PendingClear /></DCArtboard>
        <DCArtboard id="clear-pop" label="B · Pop & sparkle (the commit)" width={W} height={H}><window.ClearPop /></DCArtboard>
      </DCSection>

      <DCSection
        id="jumble"
        title="In-game · Jumble assist"
        subtitle="Hints are gone (they don't fit a falling board). Jumble stays — it sweeps up every landed letter and drops them back into random columns. Heights are NOT preserved: the whole stack reshuffles into fresh random columns (still gravity-settled, so nothing floats). Three per game; when the counter hits 0 the badge flips to ▶ for a rewarded ad."
      >
        <DCArtboard id="jb-default" label="A · Default (3 jumbles)" width={W} height={H}><window.JumbleDefault /></DCArtboard>
        <DCArtboard id="jb-active" label="B · Jumbling (scrambling)" width={W} height={H}><window.JumbleActive /></DCArtboard>
        <DCArtboard id="jb-spent" label="C · Jumbles spent (→ ad)" width={W} height={H}><window.JumbleSpent /></DCArtboard>
      </DCSection>

      <DCSection
        id="swap"
        title="In-game · Swap the falling tile"
        subtitle="Two free swaps per game. Tap Swap to instantly replace the letter that's currently dropping with a fresh random one — perfect when the live tile (a Q, a Z) won't fit anywhere useful. The queued NEXT tiles are untouched. When both swaps are gone the badge flips to ▶ for a rewarded ad (+1 swap)."
      >
        <DCArtboard id="sw-ready" label="A · Two swaps ready" width={W} height={H}><window.SwapReady /></DCArtboard>
        <DCArtboard id="sw-demo" label="B · Swapping (live tile → new letter)" width={W} height={H}><window.SwapDemo /></DCArtboard>
        <DCArtboard id="sw-spent" label="C · Swaps spent (→ ad)" width={W} height={H}><window.SwapSpent /></DCArtboard>
      </DCSection>

      <DCSection
        id="ads"
        title="Rewarded ads & revive"
        subtitle="The 5-second rewarded ad now grants +1 jumble. Topping out offers a once-per-game revive: watch an ad to clear the bottom rows and keep playing."
      >
        <DCArtboard id="ad" label="D · Rewarded ad (+1 jumble)" width={W} height={H}><window.AdOverlay /></DCArtboard>
        <DCArtboard id="revive" label="E · Stacked out → revive" width={W} height={H}><window.Revive /></DCArtboard>
      </DCSection>

      <DCSection
        id="accounts"
        title="Accounts & Premium"
        subtitle="Identifier-first auth: one entry (socials + email). Known email → password; unknown email → create; a social sign-in with no name → display name. Then profile (free/premium) and the $5 one-time paywall (no ads · unlimited jumbles)."
      >
        <DCArtboard id="auth-entry" label="F · Continue (entry)" width={W} height={H}><window.AuthEntry /></DCArtboard>
        <DCArtboard id="auth-pw" label="G · Known email → password" width={W} height={H}><window.AuthPassword /></DCArtboard>
        <DCArtboard id="auth-create" label="H · New email → create" width={W} height={H}><window.AuthCreate /></DCArtboard>
        <DCArtboard id="auth-social" label="I · New social → display name" width={W} height={H}><window.AuthSocialName /></DCArtboard>
        <DCArtboard id="profile-free" label="J · Profile (free)" width={W} height={H}><window.Profile premium={false} /></DCArtboard>
        <DCArtboard id="paywall" label="K · Go Premium ($5 one-time)" width={W} height={H}><window.Paywall /></DCArtboard>
        <DCArtboard id="profile-prem" label="L · Profile (premium · ad-free)" width={W} height={H}><window.Profile premium={true} /></DCArtboard>
      </DCSection>

      <DCSection
        id="endgame"
        title="High-score moment & game over"
        subtitle="The 'New Best!' flourish fires in-game the instant your live score passes your all-time best (play continues). At game over you see either the celebration or the neutral 'Stacked Out' results."
      >
        <DCArtboard id="newbest" label="M · In-game: new best! (live)" width={W} height={H}><window.NewBestMoment /></DCArtboard>
        <DCArtboard id="gameover" label="N · Game over (no record)" width={W} height={H}><window.GameOver /></DCArtboard>
        <DCArtboard id="nhs" label="O · Game over (new high score)" width={W} height={H}><window.NewHighScore /></DCArtboard>
      </DCSection>

      <DCSection
        id="home"
        title="Home / menu (after login)"
        subtitle="The landing page once signed in: New Game, High Scores, and Go Premium (hidden for premium members). Plus the High Scores list — ranked by score, with words cleared."
      >
        <DCArtboard id="home-free" label="P · Home (free)" width={W} height={H}><window.Home premium={false} /></DCArtboard>
        <DCArtboard id="home-prem" label="Q · Home (premium)" width={W} height={H}><window.Home premium={true} /></DCArtboard>
        <DCArtboard id="highscores" label="R · High Scores" width={W} height={H}><window.HighScores /></DCArtboard>
      </DCSection>

      <DCSection
        id="account-mgmt"
        title="Account management"
        subtitle="Changing your (unique) display name, and the forgot-password → email-sent → reset-password flow."
      >
        <DCArtboard id="editname" label="S · Edit display name" width={W} height={H}><window.EditName /></DCArtboard>
        <DCArtboard id="forgot" label="T · Forgot password (email sent)" width={W} height={H}><window.ForgotSent /></DCArtboard>
        <DCArtboard id="reset" label="U · Reset password" width={W} height={H}><window.ResetPassword /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FeaturesApp />);
