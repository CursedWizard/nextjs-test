import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {isError} from "@tanstack/react-query";
import {Field, Formik, useFormik} from "formik";
import {merge} from "lodash";
import {usePaginatedData} from '../../utils/usePaginatedData';


import React from "react";
import {z} from "zod";
import {normalizeInput} from "../../utils/format-phone";
import {createValidationError, toFormikValidationSchema} from "../../utils/formik-validation-schema";
import {VacancyType} from "../../utils/useVacanciesData";
import {Card} from "../card";
import {Pagination} from "../pagination";

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

export const applyForSchema = z.object({
  lastName: z.string().min(1, "Поле не должно быть пустым"),
  firstName: z.string().min(1, "Поле не должно быть пустым"),
  parentName: z.string().optional(),
  phoneNumber: z.string().length(18, "Номер должен быть в формате: +7 (999) 999-99-99").min(1, "Поле не должно быть пустым"),
})

export const VacanciesList: React.FC<VacanciesProps> = ({ vacancies }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [clickedVacancy, setClickedVacancy] = React.useState<VacancyType | null>(null);
  const [phoneValue, setPhoneValue] = React.useState("");
  const [agreePersonalData, setAgreePersonalData] = React.useState(false);
  const cancelRef = React.useRef(null)

  const {handleSubmit, errors, touched, values, handleChange} = useFormik({
    initialValues: {
      lastName: "",
      firstName: "",
      parentName: "",
      phoneNumber: "",
    },
    validate: (values) =>
      toFormikValidationSchema(
        merge(values, { phoneNumber: phoneValue }),
        applyForSchema
      ),
    onSubmit: (values) => {
      alert(
        `Вы откликнулись: \n\n ${JSON.stringify(
          merge(values, {
            vacancy_id: clickedVacancy!.vacancy_id,
            vacancy_name: clickedVacancy!.proftitle,
          }),
          null,
          2
        )}`
      );
    },
  });


  const handleCardOpen = (vacancy: VacancyType) => {
    onOpen();
    setClickedVacancy(vacancy);
  }

  const handleCloseModal = () => {
    onClose();
    setClickedVacancy(null);
  }

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
      <SimpleGrid columns={[1, null, null, 2, 3]} spacingX={4} spacingY={4}>
        {paginatedData.map((vacancy, index) => {
          return (
            <VacancyCard
              onOpen={handleCardOpen}
              vacancy={vacancy}
              key={`vac-card-${index}`}
            />
          );
        })}
      </SimpleGrid>
      <Pagination
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        nextPage={handleNextPage}
        previousPage={handlePrevPage}
        page={paginationInfo.page}
      />
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={handleCloseModal}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="2xl">Откликнуться</AlertDialogHeader>
          <AlertDialogCloseButton mt="8px" />
          <form onSubmit={handleSubmit}>
            <AlertDialogBody>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.lastName && touched.lastName}>
                  <FormLabel htmlFor="lastName">Фамилия</FormLabel>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Фамилия"
                    onChange={handleChange}
                    value={values.lastName}
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.firstName && touched.firstName}
                >
                  <FormLabel htmlFor="firstName">Имя</FormLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Имя"
                    onChange={handleChange}
                    value={values.firstName}
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="parentName">Отчество</FormLabel>
                  <Input
                    id="parentName"
                    name="parentName"
                    placeholder="Отчество"
                    onChange={handleChange}
                    value={values.parentName}
                  />
                  <FormErrorMessage>{errors.parentName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.phoneNumber && touched.phoneNumber}
                >
                  <FormLabel htmlFor="phoneNumber">Номер телефона</FormLabel>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+7 (999) 999-99-99"
                    value={phoneValue}
                    onChange={(e: any) => {
                      setPhoneValue(
                        normalizeInput(e.target.value!, phoneValue)
                      );
                    }}
                  />
                  <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                </FormControl>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <VStack align="start" spacing={3}>
                <Checkbox
                  id="agree"
                  name="agree"
                  onChange={() => setAgreePersonalData(!agreePersonalData)}
                  isChecked={agreePersonalData}
                  colorScheme="orange"
                  display="flex"
                  alignItems="start"
                >
                  <Text color="gray.400" fontSize="12px">
                    Я даю согласие на обработку своих персональных данных в
                    соответствии с положением об обработке персональных данных.
                  </Text>
                </Checkbox>
                <Button
                  type="submit"
                  ml={0}
                  mt={2}
                  size="xl"
                  disabled={!agreePersonalData}
                  colorScheme="orange"
                  variant="solid"
                >
                  Откликнуться
                </Button>
              </VStack>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

