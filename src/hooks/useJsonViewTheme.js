import useStudioTheme from './useStudioTheme';

/* rjv-default's hues, lightened for the dark Studio surface; a transparent base00
 * keeps the tree on that surface */
const JSON_THEME_DARK = {
  base00: 'rgba(0, 0, 0, 0)',
  base01: '#262b36',
  base02: '#2f3440',
  base03: '#8f97a6',
  base04: '#8f97a6',
  base05: '#b3bac6',
  base06: '#e1e4ea',
  base07: '#e1e4ea',
  base08: '#f472b6',
  base09: '#fb923c',
  base0A: '#fca5a5',
  base0B: '#a3e635',
  base0C: '#a5b4fc',
  base0D: '#b3bac6',
  base0E: '#2dd4bf',
  base0F: '#60a5fa',
};

/* The react-json-view theme that follows the Studio: its default unless dark */
export default function useJsonViewTheme() {
  return useStudioTheme() === 'dark' ? JSON_THEME_DARK : 'rjv-default';
}
