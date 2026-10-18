export function WorldIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'executive' ? <><path d="M4 28h24M7 28V12h18v16M12 12V7h8v5M16 7V3h8l-2 2 2 2M12 18h2m4 0h2m-8 5h2m4 0h2"/></> : kind === 'judicial' ? <><path d="M16 4v23M5 28h22M6 9h20M8 9 3 20h10L8 9Zm16 0-5 11h10L24 9Z"/><circle cx="16" cy="7" r="2"/></> : kind === 'economy' ? <><path d="M4 27h25M7 23v-7h4v7m5 0V11h4v12m5 0V5h4v18M5 10l8-5 6 2 8-5"/></> : <><path d="m3 11 13-8 13 8ZM4 28h24M7 15v9m6-9v9m6-9v9m6-9v9M4 25h24"/></>}
  </svg>;
}
