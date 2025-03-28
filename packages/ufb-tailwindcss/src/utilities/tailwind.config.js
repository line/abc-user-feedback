import plugin from "tailwindcss/plugin";
import theme from "../theme";

function filterDefault(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => key !== "DEFAULT")
  );
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [{ raw: "" }],
  safelist: [
    {
      pattern:
        /(fill|text|bg|border|text-above)-neutral-(primary|secondary|tertiary|inverse|disabled|static|hover|transparent|dim)/,
    },
    {
      pattern: /bg-(primary|secondary|tertiary|dim)/,
    },
    {
      pattern: /(fill|text|border)-tint-(red|orange|green|blue)/,
    },
    {
      pattern: /bg-tint-(red|orange|green|blue)-(bold|subtle|hover|)/,
    },
    {
      pattern: /text-title-(h1|h2|h3|h4|h5)/,
    },
    {
      pattern:
        /text-(small|base|large|xlarge)-(normal|strong|underline|delete)/,
    },
    {
      pattern: /rounded(-|)(0|4|6|8|12|16|24|full|)/,
    },
    {
      pattern: /shadow(-|)(sm|md|lg|xl|2xl|inner|none|)/,
    },
  ],
  theme,
  plugins: [
    plugin(
      ({ addUtilities, matchUtilities, theme }) => {
        addUtilities({
          "@keyframes enter": theme("keyframes.enter"),
          "@keyframes exit": theme("keyframes.exit"),
          ".animate-in": {
            animationName: "enter",
            animationDuration: theme("animationDuration.DEFAULT"),
            "--tw-enter-opacity": "initial",
            "--tw-enter-scale": "initial",
            "--tw-enter-rotate": "initial",
            "--tw-enter-translate-x": "initial",
            "--tw-enter-translate-y": "initial",
          },
          ".animate-out": {
            animationName: "exit",
            animationDuration: theme("animationDuration.DEFAULT"),
            "--tw-exit-opacity": "initial",
            "--tw-exit-scale": "initial",
            "--tw-exit-rotate": "initial",
            "--tw-exit-translate-x": "initial",
            "--tw-exit-translate-y": "initial",
          },
        });

        matchUtilities(
          {
            "fade-in": (value) => ({ "--tw-enter-opacity": value }),
            "fade-out": (value) => ({ "--tw-exit-opacity": value }),
          },
          { values: theme("animationOpacity") }
        );

        matchUtilities(
          {
            "zoom-in": (value) => ({ "--tw-enter-scale": value }),
            "zoom-out": (value) => ({ "--tw-exit-scale": value }),
          },
          { values: theme("animationScale") }
        );

        matchUtilities(
          {
            "spin-in": (value) => ({ "--tw-enter-rotate": value }),
            "spin-out": (value) => ({ "--tw-exit-rotate": value }),
          },
          { values: theme("animationRotate") }
        );

        matchUtilities(
          {
            "slide-in-from-top": (value) => ({
              "--tw-enter-translate-y": `-${value}`,
            }),
            "slide-in-from-bottom": (value) => ({
              "--tw-enter-translate-y": value,
            }),
            "slide-in-from-left": (value) => ({
              "--tw-enter-translate-x": `-${value}`,
            }),
            "slide-in-from-right": (value) => ({
              "--tw-enter-translate-x": value,
            }),
            "slide-out-to-top": (value) => ({
              "--tw-exit-translate-y": `-${value}`,
            }),
            "slide-out-to-bottom": (value) => ({
              "--tw-exit-translate-y": value,
            }),
            "slide-out-to-left": (value) => ({
              "--tw-exit-translate-x": `-${value}`,
            }),
            "slide-out-to-right": (value) => ({
              "--tw-exit-translate-x": value,
            }),
          },
          { values: theme("animationTranslate") }
        );

        matchUtilities(
          { duration: (value) => ({ animationDuration: value }) },
          { values: filterDefault(theme("animationDuration")) }
        );

        matchUtilities(
          { delay: (value) => ({ animationDelay: value }) },
          { values: theme("animationDelay") }
        );

        matchUtilities(
          { ease: (value) => ({ animationTimingFunction: value }) },
          { values: filterDefault(theme("animationTimingFunction")) }
        );

        addUtilities({
          ".running": { animationPlayState: "running" },
          ".paused": { animationPlayState: "paused" },
        });

        matchUtilities(
          { "fill-mode": (value) => ({ animationFillMode: value }) },
          { values: theme("animationFillMode") }
        );

        matchUtilities(
          { direction: (value) => ({ animationDirection: value }) },
          { values: theme("animationDirection") }
        );

        matchUtilities(
          { repeat: (value) => ({ animationIterationCount: value }) },
          { values: theme("animationRepeat") }
        );
      },
      {
        theme: {
          extend: {
            animationDelay: ({ theme }) => ({
              ...theme("transitionDelay"),
            }),
            animationDuration: ({ theme }) => ({
              0: "0ms",
              ...theme("transitionDuration"),
            }),
            animationTimingFunction: ({ theme }) => ({
              ...theme("transitionTimingFunction"),
            }),
            animationFillMode: {
              none: "none",
              forwards: "forwards",
              backwards: "backwards",
              both: "both",
            },
            animationDirection: {
              normal: "normal",
              reverse: "reverse",
              alternate: "alternate",
              "alternate-reverse": "alternate-reverse",
            },
            animationOpacity: ({ theme }) => ({
              DEFAULT: 0,
              ...theme("opacity"),
            }),
            animationTranslate: ({ theme }) => ({
              DEFAULT: "100%",
              ...theme("translate"),
            }),
            animationScale: ({ theme }) => ({
              DEFAULT: 0,
              ...theme("scale"),
            }),
            animationRotate: ({ theme }) => ({
              DEFAULT: "30deg",
              ...theme("rotate"),
            }),
            animationRepeat: {
              0: "0",
              1: "1",
              infinite: "infinite",
            },
            animation: {
              in: "enter 0.15s ease-in-out",
              out: "exit 0.15s ease-in-out",
              "accordion-down": "accordion-down 0.2s ease-out",
              "accordion-up": "accordion-up 0.2s ease-out",
            },
            keyframes: {
              enter: {
                from: {
                  opacity: "var(--tw-enter-opacity, 1)",
                  transform:
                    "translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))",
                },
              },
              exit: {
                to: {
                  opacity: "var(--tw-exit-opacity, 1)",
                  transform:
                    "translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))",
                },
              },
              "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
              },
              "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
              },
            },
          },
        },
      }
    ),
    plugin(({ addBase }) => {
      addBase(require("../../dist/base"));
    }),
  ],
};

// {
//   pattern:
//     /(bg|text|fill|border|text-above)-neutral-(primary|secondary|tertiary|quaternary|dim|)/,
// },
