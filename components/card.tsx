import {Box, BoxProps} from "@chakra-ui/react";
import {forwardRef, PropsWithChildren} from "react";

export interface CardProps extends PropsWithChildren<BoxProps> {}

export const Card: React.FC<CardProps> = (props, asd) => {
  const { children, ...rest } = props;

  return (
    <Box
      __css={{
        flexShrink: 0,
        flexGrow: 0,
        width: "300px",
        shadow: "base",
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

