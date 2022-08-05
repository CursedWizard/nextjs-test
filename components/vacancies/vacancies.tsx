import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {usePaginatedData} from '../../utils/usePaginatedData';

import React, {memo, useCallback} from "react";
import {z} from "zod";
import {VacancyType} from "../../utils/useVacanciesData";
import {Card} from "../card";
import {Pagination} from "../pagination";
import {VacancyDialog} from "./vacancy-dialog";

export type VacancyCardProps = {
  vacancy: VacancyType;
  onOpen: (vacancy: VacancyType) => void;
};

const getKnownSalary = (vacancy: VacancyType) => {
  if (vacancy.salary_month)
    return `${vacancy.salary_month} р./мес.`;
  return vacancy.salary_volume_ex
}

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, onOpen }) => {
  return (
    <Card
      key={vacancy.vacancy_id}
      borderRadius={"6px"}
      py={6}
      px={5}
      width={"100%"}
      minW="250px"
    >
    <Flex direction="column" justifyContent="space-between" height="full">
      <Box>
      <Text color="gray.400" fontSize="sm" mb={4}>
        {vacancy.placetitle}
      </Text>
      <Flex
        wordBreak="break-word"
        pb="30px"
        mb="30px"
        borderBottom="1px solid #e1e1e1"
      >
        <Heading flexShrink={1} size="md" wordBreak="break-word">
          {vacancy.proftitle}
        </Heading>
      </Flex>
      <Stack spacing={5}>
        <Text fontSize="lg">{getKnownSalary(vacancy)}</Text>
        <Text fontSize="lg">{vacancy.directiontitle}</Text>
        <Text fontSize="lg">{vacancy.clientname}</Text>
      </Stack>
      </Box>
      <Stack direction="column" spacing={2} mt={6}>
        <Button variant="outline">
          Подробнее
        </Button>
        <Button variant="solid" colorScheme="orange" onClick={() => onOpen(vacancy)}>Откликнуться!</Button>
      </Stack>
      </Flex>
    </Card>
  );
};

export type VacanciesProps = {
  vacancies: VacancyType[];
};

const VacancyGrid = memo(({
  vacancies,
  onCardOpen
}: VacanciesProps & { onCardOpen: (vacancy: VacancyType) => void }) => {
  return (
    <SimpleGrid columns={[1, null, null, 2, 3]} spacingX={4} spacingY={4}>
      {vacancies.map((vacancy, index) => {
        return (
          <VacancyCard
            onOpen={onCardOpen}
            vacancy={vacancy}
            key={`vac-card-${index}`}
          />
        );
      })}
    </SimpleGrid>
  );
});

export const VacanciesList: React.FC<VacanciesProps> = ({ vacancies }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clickedVacancy, setClickedVacancy] = React.useState<VacancyType | null>(null);

  const handleCardOpen = useCallback((vacancy: VacancyType) => {
    onOpen();
    setClickedVacancy(vacancy);
  }, [onOpen]);

  const {
    data: paginatedData,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    paginationInfo,
  } = usePaginatedData<VacancyType>({
    initialData: vacancies,
    pageSize: 6,
  });

  const handleNextPage = () => {
    nextPage();
    window.scrollTo({ top: 0 });
  };

  const handlePrevPage = () => {
    previousPage();
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <VacancyGrid vacancies={paginatedData} onCardOpen={handleCardOpen} />
      <Pagination
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        nextPage={handleNextPage}
        previousPage={handlePrevPage}
        page={paginationInfo.page}
      />
      <VacancyDialog
        isOpen={isOpen}
        onClose={onClose}
        setClickedVacancy={setClickedVacancy}
        clickedVacancy={clickedVacancy}
      />
    </>
  );
};

