import { useCallback, useEffect, useRef, useState } from "react";
import {useQuery} from "@tanstack/react-query";
import {z} from "zod";
import { SetOptional } from 'type-fest';
import invariant from 'tiny-invariant';

const vacancyValidator = z.object({
    vacancy_id: z.number(),
    vacplacement_id: z.number(),
    profid: z.number(),
    proftitle: z.string(),
    placeid: z.number().nullable(),
    placetitle: z.string().nullable(),
    salary_volume: z.union([z.string(), z.number()]),
    salary_type: z.number(),
    directionid: z.number(),
    directiontitle: z.string(),
    stafftype: z.number(),
    vdescription: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    is_active: z.number(),
    salary_volume_ex: z.string(),
    clientid: z.number(),
    clientname: z.string(),
    flghot: z.number().nullable(),
    region_id: z.number().nullable(),
    search_desc: z.string(),
    search_geo: z.string(),
    regionname: z.string().nullable(),
    stationname: z.string().nullable(),
    numentries: z.string().nullable(),
    numgeoentries: z.string().nullable(),
    baseindex: z.number(),
    flgstemmer: z.number(),
    salary_type_title: z.string(),
    salary_hour: z.preprocess((val) => Number(val), z.number()).nullable(),
    salary_day: z.union([z.string(), z.number()]).nullable(),
    salary_week: z.union([z.string(), z.number()]).nullable(),
    salary_month: z.union([z.string(), z.number()]).nullable(),
    websitevacancynum: z.string().nullable(),
})

const vacanciesValidator = z.array(vacancyValidator);

export type VacancyType = z.infer<typeof vacancyValidator>;
export type VacanciesType = z.infer<typeof vacanciesValidator>;

export const useVacanciesData = () => {
  return useQuery(["vacancies"], () =>
    fetch("https://gsr-rabota.ru/api/v2/GetAllVacancies").then(
      async (res) => {
        const _res = await res.json();

        /**
          * Since we are not sure about the
          * structure of the data, parse it first
          * to avoid further errors
          */
        return await vacanciesValidator.parseAsync(_res);
      }
    ),
    { refetchOnWindowFocus: false }
  );
};

type CityID = number;
type CityMapData = {
  cityName: string;

  /**
   * Region index the city belongs to
   */
  regionIndex: number;

  cityIndex: number;

  /**
   * Store vacancies by city
   */
  vacancies: VacanciesType;

  // TODO: should be removed (bad for scaling)
  clients: Set<number>;
}

type RegionID = number;
type RegionMapData = {
  regionName: string;

  regionIndex: number;

  cities: Set<CityID>;
}

export type PlaceType = {
  name: string;
  index: number;
}

type ProcessedData = {
  currentRegion: PlaceType | null;
  currentCity: PlaceType | null;
  currentClient: PlaceType | null;
  vacancies: VacanciesType;
  availableCities: Array<CityMapData>;
  availableRegions: Array<RegionMapData>;
  availableClients: Array<PlaceType>;
}

type Nullable<T> = { [P in keyof T]?: T[P] | null };

export const useProcessedVacanciesData = () => {
  const { data: allVacancies, ...rest } = useVacanciesData();

  const [processedData, setProcessedData] = useState<ProcessedData>({
    currentRegion: null,
    currentCity: null,
    currentClient: null,
    vacancies: [],
    availableCities: [],
    availableRegions: [],
    availableClients: [],
  });

  /**
   * General utility to filter vacancies by any
   * property of the vacancy object (except city or region)
   */
  const filterVacancies = (vacancies: VacanciesType) => {
    const filterBy: Nullable<VacancyType> = {
      clientid: processedData.currentClient?.index,
    };
    return vacancies.filter((vacancy) => {
      return Object.keys(filterBy).every((key) => {
        // @ts-ignore
        if (filterBy[key] === null || filterBy[key] === undefined) return true;
        // @ts-ignore
        return vacancy[key] === filterBy[key];
      });
    });
  };

  /**
   * Store in ref to avoid recomputing
   */
  const maps = useRef<{
    cities: Map<RegionID, CityMapData>;
    regions: Map<RegionID, RegionMapData>;
    clients: Map<number, string>;
  } | null>(null);

  /**
   * TODO: should be removed (bad for scaling)
   */
  const getClientsByRegion = (region: RegionMapData): Array<PlaceType> => {
    const clients: Set<number> = new Set();
    region.cities.forEach((cityId) => {
      const city = maps.current!.cities.get(cityId)!;
      city.clients.forEach((clientId) => {
        clients.add(clientId);
      });
    });
    return Array.from(clients).map((clientId) => {
      return {
        name: maps.current!.clients.get(clientId)!,
        index: clientId,
      };
    });
  };

  const getAllClients = (): Array<PlaceType> => {
    if (!maps.current) return [];

    const clients = new Set<number>();
    maps.current.regions.forEach((region) => {
      const regionClients = getClientsByRegion(region);
      regionClients.forEach((client) => {
        clients.add(client.index);
      });
    });

    return Array.from(clients).map((clientId) => {
      return {
        name: maps.current!.clients.get(clientId)!,
        index: clientId,
      };
    });
  };

  const setRegion = useCallback(
    (region: SetOptional<PlaceType, "name"> | null) => {
      if (!maps.current) return;

      /**
       * Unselect the region if null passed
       */
      if (!region) {
        setProcessedData((prevState) => ({
          ...prevState,
          currentRegion: null,
        }));

        return;
      }

      const mappedRegion = maps.current.regions.get(region.index);
      invariant(mappedRegion, "Region doesn't exist");
      const availableCities = Array.from(mappedRegion.cities).map((cityId) => {
        const city = maps.current!.cities.get(cityId)!;
        return city;
      });

      /**
       * logic of generating autocompletion for filters probalby
       * should be a responsibility of a filter method
       * since it already loops through all the vacancies
       * TODO: move to filter vacancy method
       */
      const availableClients = getClientsByRegion(mappedRegion);

      setProcessedData((prevState) => ({
        ...prevState,
        currentRegion: { name: mappedRegion.regionName, index: region.index },
        availableCities,
        availableClients,
      }));
    },
    []
  );

  const setCity = useCallback((city: PlaceType) => {
    if (!maps.current) return;
    const mappedCity = maps.current.cities.get(city.index);
    invariant(mappedCity, "City doesn't exist");

    setRegion({ index: mappedCity.regionIndex });

    setProcessedData((prevState) => ({
      ...prevState,
      currentCity: city,
      availableClients: Array.from(mappedCity.clients.values()).map((id) => ({
        name: maps.current!.clients.get(id)!,
        index: id,
      })),
    }));
  }, []);

  const reset = useCallback(() => {
    invariant(maps.current, "Maps are not initialized");
    const { regions, cities } = maps.current;

    setProcessedData((prevState) => ({
      ...prevState,
      availableCities: Array.from(cities.values()),
      availableRegions: Array.from(regions.values()),
      availableClients: getAllClients(),
      currentClient: null,
      currentRegion: null,
      currentCity: null,
    }));
  }, []);

  /**
   * Side effect to unselect current city in case
   * selected region and city do not match
   */
  useEffect(() => {
    if (
      !maps.current ||
      !processedData.currentCity ||
      !processedData.currentRegion
    )
      return;

    const mappedRegion = maps.current.regions.get(
      processedData.currentRegion.index
    );
    invariant(mappedRegion, "Region doesn't exist");

    if (!mappedRegion.cities.has(processedData.currentCity.index))
      setProcessedData((prevState) => ({
        ...prevState,
        currentCity: null,
      }));
  }, [processedData.currentCity, processedData.currentRegion]);

  /**
   * Side effect to update vacancies
   */
  useEffect(() => {
    if (!maps.current) return;

    if (processedData.currentCity) {
      const mappedCity = maps.current.cities.get(
        processedData.currentCity.index
      );
      invariant(mappedCity, "City doesn't exist");

      setProcessedData((prevState) => ({
        ...prevState,
        vacancies: filterVacancies(mappedCity.vacancies),
      }));
    } else if (processedData.currentRegion) {
      const mappedRegion = maps.current.regions.get(
        processedData.currentRegion.index
      );
      invariant(mappedRegion, "Region doesn't exist");

      const regionVacancies: VacanciesType = [];
      for (const cityId of Array.from(mappedRegion.cities.values())) {
        const mappedCity = maps.current.cities.get(cityId)!;
        regionVacancies.push(...mappedCity.vacancies);
      }

      setProcessedData((prevState) => ({
        ...prevState,
        vacancies: filterVacancies(regionVacancies),
      }));
    } else {
      if (!allVacancies) return;

      setProcessedData((prevState) => ({
        ...prevState,
        vacancies: filterVacancies(allVacancies),
      }));
    }
  }, [
    processedData.currentRegion,
    processedData.currentCity,
    processedData.currentClient,
  ]);

  /**
   * Onmount hook to normilize data by
   * creating dedicated maps
   */
  useEffect(() => {
    if (!allVacancies) return;

    const regionsMap = new Map<RegionID, RegionMapData>();
    const citiesMap = new Map<CityID, CityMapData>();

    maps.current = {
      regions: regionsMap,
      cities: citiesMap,
      clients: new Map<number, string>(),
    };

    for (let vacancy of allVacancies) {
      if (
        vacancy.region_id &&
        vacancy.regionname &&
        vacancy.placeid &&
        vacancy.placetitle
      ) {
        maps.current.clients.set(vacancy.clientid, vacancy.clientname);
        const region = regionsMap.get(vacancy.region_id);
        const city = citiesMap.get(vacancy.placeid);

        if (!city) {
          citiesMap.set(vacancy.placeid, {
            cityName: `${vacancy.placetitle} (${vacancy.regionname})`,
            vacancies: [vacancy],
            cityIndex: vacancy.placeid,
            regionIndex: vacancy.region_id,
            clients: new Set([vacancy.clientid]),
          });
        } else {
          city.vacancies.push(vacancy);
          city.clients.add(vacancy.clientid);
        }

        if (!region) {
          regionsMap.set(vacancy.region_id, {
            regionName: vacancy.regionname,
            cities: new Set([vacancy.placeid!]),
            regionIndex: vacancy.region_id,
          });
        } else {
          region.cities.add(vacancy.placeid);
        }
      }
    }

    setProcessedData((prevState) => ({
      ...prevState,
      vacancies: allVacancies,
      availableCities: Array.from(citiesMap.values()),
      availableRegions: Array.from(regionsMap.values()),
      availableClients: getAllClients(),
    }));
  }, [allVacancies]);

  const setClient = useCallback((client: PlaceType | null) => {
    setProcessedData((prevState) => ({
      ...prevState,
      currentClient: client,
    }));
  }, []);

  return {
    cities: processedData.availableCities,
    regions: processedData.availableRegions,
    clients: processedData.availableClients,
    currentRegion: processedData.currentRegion,
    currentCity: processedData.currentCity,
    currentClient: processedData.currentClient,
    vacancies: processedData.vacancies,
    setRegion,
    setCity,
    setClient,
    reset,
    ...rest,
  };
};
