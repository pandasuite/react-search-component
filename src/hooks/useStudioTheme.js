import { useState, useEffect } from 'react';
import PandaBridge from 'pandasuite-bridge';

/* The theme of the Studio appearance ('light' or 'dark'); undefined until the
 * Studio sends it. Outside the Studio, an appearance is not followed: as with
 * followStudioAppearance(), a project stays as it is, whatever sends one. */
export default function useStudioTheme() {
  const [theme, setTheme] = useState(
    PandaBridge.isStudio && PandaBridge.appearance ? PandaBridge.appearance.theme : undefined,
  );
  useEffect(() => {
    if (!PandaBridge.isStudio) {
      return undefined;
    }
    return PandaBridge.onAppearanceChange((appearance) => setTheme(appearance.theme));
  }, []);
  return theme;
}
