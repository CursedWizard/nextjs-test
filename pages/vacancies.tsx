import {Box, Button, CircularProgress, Code, Flex, FormControl, FormLabel, Heading, IconButton, Link, Stack, Text} from '@chakra-ui/react'
import type { NextPage } from 'next'
import {PropsWithChildren, useEffect, useMemo} from 'react';
import {
  Select,
  CreatableSelect,
  AsyncSelect,
  OptionBase,
  GroupBase
} from "chakra-react-select";
import {PlaceType, useProcessedVacanciesData, useVacanciesData, VacancyType} from '../utils/useVacanciesData';
import {usePaginatedData} from '../utils/usePaginatedData';
import {Card} from '../components/card';
import {VacanciesList} from '../components/vacancies/vacancies';
import {ArrowBackIcon, ArrowForwardIcon} from '@chakra-ui/icons';
import {CategorySelect} from '../components/vacancies/select';
import {Pagination} from '../components/pagination';

const MAX_WIDTH = '1240px';

const HeaderBar = () => {
  return (
    <Box px={6} w="full">
      <Flex
        mx="auto"
        maxW={MAX_WIDTH}
        height="100px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text>React solution</Text>
        <Link color="teal" href="#">Go to Vue solution</Link>
      </Flex>
    </Box>
  );
}

interface EntityType extends OptionBase {
  label: string;
  value: string | number;
}

const Vacancies: NextPage = () => {
  const {
    isLoading,
    cities,
    regions,
    currentRegion,
    currentCity,
    currentClient,
    setClient,
    setRegion,
    reset,
    setCity,
    vacancies,
    clients,
    error,
  } = useProcessedVacanciesData();

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

  useEffect(() => {
    if (vacancies) console.log(vacancies);
  }, [vacancies]);

  useEffect(() => {
    error && console.error(error);
    // cities && console.debug(cities);
    // regions && console.debug(regions);

    // vacancies && console.debug(vacancies);
  }, [regions, vacancies, cities, isLoading, error]);

  const autoCompleteCities = useMemo(() => {
    return cities.map((city) => {
      return {
        label: city.cityName,
        value: city.cityIndex,
      }
    })
  }, [cities]);

  const autoCompleteClients = useMemo(() => {
    return clients.map((client) => {
      return {
        label: client.name,
        value: client.index,
      };
    });
  }, [clients]);

  return (
    <Box>
      <HeaderBar />
      <Box px={6} maxW={MAX_WIDTH} mx="auto">
        <Flex direction="row" gap={8} py={4}>
          <Stack spacing={4} display={["none", "none", "flex"]}>
            <Heading fontSize="24px">Поиск по категориям</Heading>
            <Card w="290px" borderRadius={8} py={4} px={6}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Регион</FormLabel>
                  <CategorySelect
                    id="region-select"
                    options={regions.map((region) => ({
                      label: region.regionName,
                      value: region.regionIndex,
                    }))}
                    placeholder="Выберите регион"
                    onChange={(e) =>
                      e && setRegion({ name: e.label, index: Number(e.value) })
                    }
                    value={
                      currentRegion && {
                        label: currentRegion.name,
                        value: currentRegion.index,
                      }
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Город</FormLabel>
                  <CategorySelect
                    id="city-select"
                    options={autoCompleteCities}
                    placeholder="Выберите город"
                    onChange={(e) =>
                      e && setCity({ name: e.label, index: Number(e.value) })
                    }
                    value={
                      currentCity && {
                        value: currentCity.index,
                        label: currentCity.name,
                      }
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Организация</FormLabel>
                  <CategorySelect
                    id="client-select"
                    options={autoCompleteClients}
                    value={
                      currentClient && {
                        value: currentClient.index,
                        label: currentClient.name,
                      }
                    }
                    onChange={(e) =>
                      e && setClient({ name: e.label, index: Number(e.value) })
                    }
                    placeholder="Выберите организацию"
                  />
                </FormControl>
              </Stack>
              <Button
                colorScheme="orange"
                mt={8}
                w="100%"
                variant="outline"
                onClick={() => reset()}
              >
                Сбросить
              </Button>
            </Card>
          </Stack>
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

                <VacanciesList vacancies={paginatedData} />
                <Pagination
                  canNextPage={canNextPage}
                  canPreviousPage={canPreviousPage}
                  nextPage={nextPage}
                  previousPage={previousPage}
                  page={paginationInfo.page}
                />
              </>
            )}
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}

export default Vacancies
