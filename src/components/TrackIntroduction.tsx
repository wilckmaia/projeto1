import type { Track } from '@/lib/education';
export function TrackIntroduction({ track }: { track: Track }) {
  return <div className="track-introduction">
    {track.overview && <p>{track.overview}</p>}
    {track.internalTopics && <p>{track.internalTopics}</p>}
    <p>{track.description}</p>
    {track.reference && <p><a className="track-reference" href={track.reference.url} target="_blank" rel="noreferrer">{track.reference.label}</a></p>}
  </div>;
}
