/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "brand-bg": "#191716",
        "brand-icon": "#343a40",
        "brand-yellow": "#FAE3AD",
        "brand-linkedin": "#0B65C3",
        "brand-twitch": "#9146FF",
        "brand-twitter": "#1DA1F2",
        "brand-discord": "#5865F2",
        cActiveMenu: "#0f0f13",
      },
      transitionTimingFunction: {
        "drop-out": "cubic-bezier(0.7, 0.006, 0.2, 1)",
      },
      boxShadow: {
        elevation:
          "0 10px 15px rgb(17 24 39 / 10%),0 4px 6px -2px rgb(17 24 39 / 5%)",
        low: "0 1px 2px rgb(0 0 0 / 5%)",
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
