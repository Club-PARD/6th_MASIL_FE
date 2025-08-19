import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
 
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard-Regular", ...defaultTheme.fontFamily.sans],
        jalnan: ["yg-jalnan", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;