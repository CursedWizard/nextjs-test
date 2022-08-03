import {Box, Code, Flex, FormControl, FormLabel, Heading, Link, Stack, Text} from '@chakra-ui/react'
import type { NextPage } from 'next'
import {PropsWithChildren} from 'react';
import {
  Select,
  CreatableSelect,
  AsyncSelect,
  OptionBase,
  GroupBase
} from "chakra-react-select";

const HeaderBar = () => {
  return (
    <Box px={9} w="full">
      <Flex
        mx="auto"
        maxW="1170px"
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

const Card: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <Box borderRadius={8} px={2} w="300px" shadow="base">
      {children}
    </Box>
  );
};
export const colorOptions = [
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" }
];
export const flavorOptions = [
  { value: "vanilla", label: "Vanilla", rating: "safe" },
  { value: "chocolate", label: "Chocolate", rating: "good" },
  { value: "strawberry", label: "Strawberry", rating: "wild" },
  { value: "salted-caramel", label: "Salted Caramel", rating: "crazy" }
];
export const groupedOptions = [
  {
    label: "Colours",
    options: colorOptions
  },
  {
    label: "Flavours",
    options: flavorOptions
  }
];

interface FlavorOrColorOption extends OptionBase {
  label: string;
  value: string;
  color?: string;
  rating?: string;
}


const Vacancies: NextPage = () => {
  return (
    <Box>
      <HeaderBar />
      <Box maxW="1170px" mx="auto">
        <Flex dir="row">
          <Stack>
            <Heading size="md">Поиск по категориям</Heading>
            <Card>
            <Stack p={4} spacing={4}>
              <FormControl>
                <FormLabel>
                  Регион
                </FormLabel>
                <Select<
                  FlavorOrColorOption,
                  false,
                  GroupBase<FlavorOrColorOption>
                >
                  id="color-select"
                  name="colors"
                  options={groupedOptions}
                  placeholder="Выберите регион"
                  closeMenuOnSelect={true}
                  size="md"
                  // focusBorderColor="green.500"
                  useBasicStyles
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Город
                </FormLabel>
                <Select<
                  FlavorOrColorOption,
                  false,
                  GroupBase<FlavorOrColorOption>
                >
                  id="color-select"
                  name="colors"
                  options={groupedOptions}
                  placeholder="Выберите город"
                  closeMenuOnSelect={true}
                  size="md"
                  // focusBorderColor="green.500"
                  useBasicStyles
                />
              </FormControl>
              </Stack>
            </Card>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}

export default Vacancies
