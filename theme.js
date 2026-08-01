import { extendTheme } from "@chakra-ui/react";


export const theme = extendTheme({
  initialColorMode: "light", // 'dark' | 'light'
  useSystemColorMode: false,
  styles: {
    global: {
      "::-webkit-scrollbar": {
        width: "4px",
        height: "4px", // Set the height for the horizontal scrollbar
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "gray.600",
        borderRadius: "4px",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "gray.100",
      },
      "::-webkit-scrollbar-thumb:horizontal": {
        backgroundColor: "gray.600",
        borderRadius: "4px",
      },
      "::-webkit-scrollbar-track:horizontal": {
        backgroundColor: "gray.100",
      },
    },
  },
  fonts: {
    body: "Cairo, sans-serif",
    heading: "Cairo, sans-serif",
    mono: "Cairo, monospace",
  },
  colors: {
    main: {
      50: "#edf8f5",
      100: "#d7f0ea",
      200: "#afe1d5",
      300: "#81cdbc",
      400: "#5ab9a3",
      500: "#46ae97",
      600: "#348b78",
      700: "#2c7062",
      800: "#285a50",
      900: "#244b44",
      950: "#102b27",
      default: "#46ae97",
    },
    blue: {
      50: "#edf8f5",
      100: "#d7f0ea",
      200: "#afe1d5",
      300: "#81cdbc",
      400: "#5ab9a3",
      500: "#46ae97",
      600: "#348b78",
      700: "#2c7062",
      800: "#285a50",
      900: "#244b44",
    },
  },

  components: {
    Button: {
      variants: {
        blackButton: {
          color: "white",
          bg: "#000",
          _hover: {
            bg: "#000",
          },
        },
        gray: {
          color: "#000",
          bg: "gray.100",
          _hover: {
            bg: "gray.100",
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "15px", // Adjust the font size as needed
      },
    },
  },
});
