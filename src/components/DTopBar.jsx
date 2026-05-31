import Logo from './Logo';
import AssistBtn from './AssistBtn';
import { JumbleIcon, SwapIcon, PauseIcon } from './icons';

export default function DTopBar({
  jumbles = 3,
  swaps = 2,
  onJumble,
  onSwap,
  onPause,
}) {
  return (
    <div className="ptop">
      <div className="plogo">
        <Logo s={27} />
      </div>
      <div className="icons">
        <AssistBtn
          label="Jumble"
          depleted={jumbles === 0}
          badge={jumbles === 0 ? '▶' : jumbles}
          badgeAd={jumbles === 0}
          onClick={onJumble}
        >
          <JumbleIcon />
        </AssistBtn>
        <AssistBtn
          label="Swap"
          variant="swap"
          depleted={swaps === 0}
          badge={swaps === 0 ? '▶' : swaps}
          badgeAd={swaps === 0}
          onClick={onSwap}
        >
          <SwapIcon />
        </AssistBtn>
        <AssistBtn label="Pause" variant="pause" onClick={onPause}>
          <PauseIcon />
        </AssistBtn>
      </div>
    </div>
  );
}
