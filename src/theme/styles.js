export const globalStyles = {
  colors: {
    palette: {
      pure: "#fffdfd",
      canvas: "#f4f4f4",
      borderLight: "#e1e1e3",
      borderMuted: "#c5c2c2",
      textMuted: "#a1a0a0",
      textPrimary: "#18181b",
    },
    gray: {
      50: "#fffdfd",
      100: "#f4f4f4",
      200: "#e1e1e3",
      300: "#c5c2c2",
      400: "#a1a0a0",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
    },
    brand: {
      50: "#fffdfd",
      100: "#f4f4f4",
      200: "#e1e1e3",
      300: "#c5c2c2",
      400: "#a1a0a0",
      500: "#18181b",
      600: "#09090b",
      700: "#000000",
      800: "#000000",
      900: "#000000",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        fontFamily: "Plus Jakarta Display, sans-serif",
        bg: "inherit",
        color: "inherit",
      },
      "*::placeholder": {
        color: "#a1a0a0",
      },
      html: {
        fontFamily: "Plus Jakarta Display, sans-serif",
        bg: "inherit",
      },
    }),
  },
};
