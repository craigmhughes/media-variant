import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";
import { useMediaQuery } from "react-responsive";
import type { Breakpoints, ScreenSize } from "../types";

const defaultSizes: Breakpoints = {
  xxl: 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
}

export type ScreenSizeContextType = {
  /** The currently active screen size based on media queries. */
  screenSize: ScreenSize;
  breakpoints: Breakpoints;
};

/**
 * React Context providing the current responsive screen size.
 * 
 * Default value is `"sm"`.
 */
export const ScreenSizeContext = createContext<ScreenSizeContextType>({
  screenSize: "sm",
  breakpoints: defaultSizes,
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
    xxl: userDefinedSizes?.xxl || defaultSizes.xxl,
    xl: userDefinedSizes?.xl   || defaultSizes.xl,
    lg: userDefinedSizes?.lg   || defaultSizes.lg,
    md: userDefinedSizes?.md   || defaultSizes.md,
    sm: userDefinedSizes?.sm   || defaultSizes.sm,
  };

  const xxl = useMediaQuery({ maxWidth: Number.MAX_SAFE_INTEGER, minWidth: sizes.xxl });
  const xl = useMediaQuery({  maxWidth: sizes.xxl  - 1,   minWidth: sizes.xl });
  const lg = useMediaQuery({  maxWidth: sizes.xl   - 1,   minWidth: sizes.lg });
  const md = useMediaQuery({  maxWidth: sizes.lg   - 1,   minWidth: sizes.md });
  const sm = useMediaQuery({  maxWidth: sizes.md   - 1    });

  const screenSize = findLargestScreenSizeMatch({ xxl, xl, lg, md, sm });

  return (
    <ScreenSizeContext.Provider value={{ screenSize, breakpoints: sizes, }}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
