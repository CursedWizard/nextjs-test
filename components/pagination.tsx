import {ArrowBackIcon, ArrowForwardIcon} from "@chakra-ui/icons";
import {Heading, IconButton, Text, Stack} from "@chakra-ui/react"

type PaginationProps = {
    page: number;
    previousPage: () => void;
    nextPage: () => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
  }
export const Pagination: React.FC<PaginationProps> = ({
  page,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
}) => {
  return (
    <Stack
      justifyContent="start"
      alignItems="center"
      direction="row"
      spacing={3}
      py={4}
      px={4}
    >
      <Text>Page: {page + 1}</Text>
      <IconButton
        size="md"
        colorScheme="gray"
        onClick={() => previousPage()}
        aria-label="Prev"
        disabled={!canPreviousPage}
        icon={<ArrowBackIcon />}
      />
      <IconButton
        size="md"
        colorScheme="gray"
        onClick={() => nextPage()}
        aria-label="Next"
        disabled={!canNextPage}
        icon={<ArrowForwardIcon />}
      />
    </Stack>
  );
};
