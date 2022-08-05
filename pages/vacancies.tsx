import {Box, CircularProgress, Flex, Heading, HStack, Link, Stack, Text} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Image from 'next/image';
import {useEffect} from 'react';
import {
  OptionBase} from "chakra-react-select";
import {useProcessedVacanciesData, VacancyType} from '../utils/useVacanciesData';
import {usePaginatedData} from '../utils/usePaginatedData';
import {VacanciesList} from '../components/vacancies/vacancies';
import {Pagination} from '../components/pagination';
import {CategoryPanel} from '../components/vacancies/category-panel';

const MAX_WIDTH = '1240px';

const HeaderBar = () => {
  return (
    <Box w="full">
      <Flex
        mx="auto"
        maxW={MAX_WIDTH}
        height="100px"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack align="center">
          <Image src="/react.png" alt="react" width="20px" height="20px" />

          <Text>React solution</Text>
        </HStack>
        <Link color="teal" href="#">
          <HStack align="center">
            <Image src="/github.svg" alt="react" width="20px" height="20px" />
            <Text>Source code</Text>
          </HStack>
        </Link>
      </Flex>
    </Box>
  );
}

const Vacancies: NextPage = () => {
  const {
    isLoading,
    vacancies,
    error,
    ...rest
  } = useProcessedVacanciesData();

  useEffect(() => {
    error && console.error(error);
  }, [error]);

  return (
    <Box px={12}>
      <HeaderBar />
      <Box maxW={MAX_WIDTH} mx="auto">
        <Flex direction="row" gap={8} py={4}>
          <CategoryPanel error={error} isLoading={isLoading} {...rest} />
          <Stack spacing={4} width="full">
            {isLoading ? (
              <CircularProgress
                alignSelf="center"
                mt={8}
                isIndeterminate
                size="100px"
                thickness="4px"
                color="green.400"
              />
            ) : (
              <>
                <Heading fontSize="24px">
                  Найдено вакансий: {vacancies.length}
                </Heading>

                <VacanciesList vacancies={vacancies} />
              </>
            )}
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}

export default Vacancies
