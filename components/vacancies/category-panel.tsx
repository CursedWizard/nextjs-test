import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { Card } from "../card";
import { CategorySelect } from "./select";
import { useProcessedVacanciesData } from "../../utils/useVacanciesData";

type CategoryPanelProps = Omit<ReturnType<typeof useProcessedVacanciesData>, "vacancies"> & {};

export const CategoryPanel: React.FC<CategoryPanelProps> = memo((props) => {
  const {
    cities,
    clients,
    regions,
    reset,
    setRegion,
    setCity,
    setClient,
    currentRegion,
    currentClient,
    currentCity,
  } = props;

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
  );
});

CategoryPanel.displayName = "CategoryPanel";
