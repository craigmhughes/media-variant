import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";
import { useMediaQuery } from "react-responsive";
import type { ScreenSize } from "../types";

const MAX_SAFE_INTEGER = 99999;

export type ScreenSizeContextType = {
  /** The currently active screen size based on media queries. */
  screenSize: ScreenSize;
};

/**
 * React Context providing the current responsive screen size.
 * 
 * Default value is `"sm"`.
 */
export const ScreenSizeContext = createContext<ScreenSizeContextType>({
  screenSize: "sm",
});

/**
 * Determines the largest matching screen size from a set of media query matches.
 *
 * @param sizes - A record mapping screen sizes to their match status (true if matched).
 * @returns The largest matching `ScreenSize`. Defaults to `"sm"` if none match.
 */
function findLargestScreenSizeMatch(sizes: Record<ScreenSize, boolean>): ScreenSize {
  return (
    sizes.xxl ? "xxl" :
    sizes.xl  ? "xl"  :
    sizes.lg  ? "lg"  :
    sizes.md  ? "md"  :
                "sm"
  );
}

/**
 * Custom hook to consume the current screen size.
 * @returns The current screen size.
 */
export function useScreenSize(): ScreenSize {
  return useContext(ScreenSizeContext).screenSize;
}

interface ScreenSizeProviderProps {
  sizes?: Record<ScreenSize, number>;
}

/**
 * Provides the current screen size to its child components via React Context.
 *
 * Uses `react-responsive` media queries based on breakpoint sizes,
 * which can be customized via `userDefinedSizes`.
 *
 * @param props.children - The React children wrapped by this provider.
 * @param props.userDefinedSizes - Optional custom breakpoint widths.
 * @returns A Context Provider exposing the current screen size.
 */
export function ScreenSizeProvider({
  children,
  sizes: userDefinedSizes,
}: PropsWithChildren<ScreenSizeProviderProps>) {
  const sizes = {
    xxl: userDefinedSizes?.xxl || 1536,
    xl: userDefinedSizes?.xl   || 1280,
    lg: userDefinedSizes?.lg   || 1024,
    md: userDefinedSizes?.md   || 768,
  };

  const xxl = useMediaQuery({ maxWidth: MAX_SAFE_INTEGER, minWidth: sizes.xxl });
  const xl = useMediaQuery({  maxWidth: sizes.xxl  - 1,   minWidth: sizes.xl });
  const lg = useMediaQuery({  maxWidth: sizes.xl   - 1,   minWidth: sizes.lg });
  const md = useMediaQuery({  maxWidth: sizes.lg   - 1,   minWidth: sizes.md });
  const sm = useMediaQuery({  maxWidth: sizes.md   - 1    });

  const screenSize = findLargestScreenSizeMatch({ xxl, xl, lg, md, sm });

  return (
    <ScreenSizeContext.Provider value={{ screenSize }}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
