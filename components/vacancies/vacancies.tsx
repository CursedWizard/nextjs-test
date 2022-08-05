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
import React from "react";
import {z} from "zod";
import {createValidationError, toFormikValidationSchema} from "../../utils/formik-validation-schema";
import {VacancyType} from "../../utils/useVacanciesData";
import {Card} from "../card";

export type VacancyCardProps = {
  vacancy: VacancyType;
  onOpen: () => void;
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
        <Button variant="solid" colorScheme="orange" onClick={onOpen}>Откликнуться!</Button>
      </Stack>
      </Flex>
    </Card>
  );
};

export type VacanciesProps = {
  vacancies: VacancyType[];
};

const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
const normilizePhoneNumber = (phone: string) => {
  let res = ""
  if (phone.length > 0)
    res += `+${phone[0]} `

  if (phone.length > 1)
    res += `(${phone[1]}`

  if (phone.length > 2)
    res += `${phone[2]}`

  if (phone.length > 3)
    res += `${phone[3]}) `

  if (phone.length > 4)
    res += `${phone[4]}`

  if (phone.length > 5)
    res += `${phone[5]}`

  if (phone.length > 6)
    res += `${phone[6]}-`

  if (phone.length > 7)
    res += `${phone[7]}`

  if (phone.length > 8)
    res += `${phone[8]}-`

  if (phone.length > 9)
    res += `${phone[9]}`

  if (phone.length > 10)
    res += `${phone[10]}`

  return res;
}

const normalizeInput = (value: string, previousValue: string) => {
  if (!value) return ""; 

  // only allows 0-9 inputs
  const numberedCurrentValue = value.replace(/[^\d]/g, '');
  if (numberedCurrentValue.length > 11)
    return previousValue;

  if (previousValue.length > value.length && !/\d/g.test(previousValue[previousValue.length - 1])) {
      return normilizePhoneNumber(
        numberedCurrentValue.slice(0, numberedCurrentValue.length - 1)
      );
    }

  return normilizePhoneNumber(numberedCurrentValue);
};

export const ApplySchema = z.object({
  lastName: z.string().min(1, "Поле не должно быть пустым"),
  firstName: z.string().min(1, "Поле не должно быть пустым"),
  parentName: z.string().optional(),
  phoneNumber: z.string().length(18, "Номер должен быть в формате: +7 (999) 999-99-99").min(1, "Поле не должно быть пустым"),
})

export const VacanciesList: React.FC<VacanciesProps> = ({ vacancies }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
        ApplySchema
      ),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const [phoneValue, setPhoneValue] = React.useState("");
  const [agreePersonalData, setAgreePersonalData] = React.useState(false);

  return (
    <>
      <SimpleGrid
        maxWidth="870px"
        columns={[1, null, null, 2, 3]}
        spacingX={4}
        spacingY={4}
      >
        {vacancies.map((vacancy, index) => {
          return (
            <VacancyCard
              onOpen={onOpen}
              vacancy={vacancy}
              key={`vac-card-${index}`}
            />
          );
        })}
      </SimpleGrid>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
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

