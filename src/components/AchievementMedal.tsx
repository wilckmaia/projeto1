import type { Achievement } from '@/lib/achievements';

export function AchievementMedal({ achievement }: { achievement: Achievement }) {
  const gradient = `gold-${achievement.worldId}`;
  return <svg className="achievement-medal" viewBox="0 0 160 180" role="img" aria-label={`Medalha dourada: ${achievement.title}`}>
    <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff1b1"/><stop offset=".4" stopColor="#e9bf56"/><stop offset=".7" stopColor="#b97a20"/><stop offset="1" stopColor="#ffe69a"/></linearGradient></defs>
    <path d="M40 102 30 170 57 154 75 174 82 108M80 108 87 174 106 154 133 170 119 101" fill={achievement.color}/>
    <path d="m47 121-8 35 17-10 12 13 6-35m14 0 6 35 12-13 17 10-8-35" fill="none" stroke="#ffffff55" strokeWidth="2"/>
    <path d="m80 8 15 7 16 1 10 13 14 8 3 16 8 15-5 16 1 16-12 11-7 15-16 4-14 9-16-5-16 1-12-12-14-7-4-16-9-14 5-16-1-16 12-11 7-15 16-4Z" fill={`url(#${gradient})`}/>
    <circle cx="80" cy="75" r="49" fill="#fff3c4" stroke="#a97626" strokeWidth="2"/>
    <circle cx="80" cy="75" r="42" fill={`url(#${gradient})`} stroke="#fff8d6" strokeWidth="2"/>
    <g fill="none" stroke="#795019" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {achievement.symbol === 'flame' ? <><path d="M80 43c5 18 24 23 20 40-3 12-13 20-24 15-18-7-17-24-6-35 0 10 4 12 6 13 8-10 3-20 4-33Z"/><path d="M80 97c-10-9-4-17 1-23 0 7 10 12 6 19"/></> : achievement.symbol === 'temple' ? <><path d="m54 62 26-17 26 17ZM57 100h46M54 106h52M60 69v24m13-24v24m14-24v24m13-24v24"/></> : <><path d="m80 45 8 20 22 2-17 15 5 22-18-12-18 12 5-22-17-15 22-2Z"/><path d="m80 64 5 12-5 9-5-9Z"/></>}
    </g>
    <path d="m130 20 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#d9a541"/>
  </svg>;
}
