import { tileVars } from '../constants/letters';

export default function DropTile({ L, cls = '', drop, delay }) {
  const style = tileVars(L);
  if (drop != null) style['--drop'] = drop + 'px';
  if (delay != null) style.animationDelay = delay + 'ms';

  return (
    <div className={`tile ${cls}`.trim()} style={style}>
      <span className="tile-letter">{L}</span>
    </div>
  );
}
