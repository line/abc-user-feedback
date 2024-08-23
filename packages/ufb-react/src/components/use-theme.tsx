import type { Radius, Size } from "../types";

const DefaultValue: {
  themeSize: Size;
  themeRadius: Radius;
} = {
  themeSize: "small",
  themeRadius: "medium",
} as const;

const useTheme = () => {
  if (typeof window !== "undefined") {
    const size = (document.body.getAttribute("data-size") ??
      DefaultValue.themeSize) as Size;
    const radius = (document.body.getAttribute("data-radius") ??
      DefaultValue.themeRadius) as Radius;
    return { themeSize: size, themeRadius: radius };
  } else {
    return DefaultValue;
  }
};

export default useTheme;
