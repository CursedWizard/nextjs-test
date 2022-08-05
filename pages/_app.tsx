import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { GlobalStyleProps } from '@chakra-ui/theme-tools'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const theme = extendTheme({
  semanticTokens: {},
  colors: {
    orange: {
      500: "#fd7f23",
      600: "#fd7614",
    },
  },
  components: {
    Button: {
      sizes: {
        xl: {
          h: "56px",
          fontWeight: "medium",
          px: "32px",
        },
        "2xl": {
          h: "72px",
          fontWeight: "medium",
          px: "32px",
          py: "24px",
        },
      },
      defaultProps: {
        colorScheme: "orange",
        size: "xl",
      },
      variants: {
        "with-shadow": {
          bg: "red.400",
          boxShadow: "0 0 2px 2px #efdfde",
        },
        outline: (props: GlobalStyleProps) => {
          const { colorScheme } = props;

          return {
            border: "2px solid",
            ...(colorScheme === "orange"
              ? { borderColor: "#fbb986", color: "#fbb986" }
              : {}),
          };
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}


export default MyApp
