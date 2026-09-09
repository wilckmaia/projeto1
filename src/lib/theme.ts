export const THEME_KEY = 'politika-theme';

// Runs in the document head, before the first paint. A blocked storage API
// must not prevent the page from loading or the toggle from working.
export const themeBootstrapScript = `(()=>{let theme='light';try{if(localStorage.getItem('${THEME_KEY}')==='dark')theme='dark'}catch{}document.documentElement.dataset.theme=theme})()`;
