import { extendTheme } from "@chakra-ui/react";


export const theme = extendTheme({
  direction: "rtl",
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
      50: "#eefbf8",
      100: "#d8f4ee",
      200: "#b5eadf",
      300: "#8addcc",
      400: "#5fc1ab",
      500: "#45ad96",
      600: "#348a78",
      700: "#2d6f62",
      800: "#28594f",
      900: "#244a43",
      950: "#102a26",
      default: "#5fc1ab",
    },
    blue: {
      50: "#eefbf8",
      100: "#d8f4ee",
      200: "#b5eadf",
      300: "#8addcc",
      400: "#5fc1ab",
      500: "#45ad96",
      600: "#348a78",
      700: "#2d6f62",
      800: "#28594f",
      900: "#244a43",
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
