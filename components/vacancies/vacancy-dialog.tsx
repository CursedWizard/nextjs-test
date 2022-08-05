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
import {useFormik} from "formik";
import React, {useCallback} from "react";
import {createValidationError, toFormikValidationSchema} from "../../utils/formik-validation-schema";
import {normalizeInput} from "../../utils/format-phone";
import {memo} from "react";
import { merge } from "lodash";
import {z} from "zod";

export const applyForSchema = z.object({
  lastName: z.string().min(1, "Поле не должно быть пустым"),
  firstName: z.string().min(1, "Поле не должно быть пустым"),
  parentName: z.string().optional(),
  phoneNumber: z.string().length(18, "Номер должен быть в формате: +7 (999) 999-99-99").min(1, "Поле не должно быть пустым"),
})

export const VacancyDialog = memo(
  ({ isOpen, onOpen, onClose, setClickedVacancy, clickedVacancy }: any) => {
    const [agreePersonalData, setAgreePersonalData] = React.useState(false);
    const cancelRef = React.useRef(null);

    const handleCloseModal = () => {
      onClose();
      setClickedVacancy(null);
    };

    const controlledInputValues = React.useRef({
      phoneNumber: "",
    });

    const { handleSubmit, errors, touched, values, handleChange } = useFormik({
      initialValues: {
        lastName: "",
        firstName: "",
        parentName: "",
        phoneNumber: "",
      },
      validate: (values) =>
        toFormikValidationSchema(
          merge(values, controlledInputValues.current),
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

    const handlePhoneChange = useCallback((e: any) => {
      controlledInputValues.current.phoneNumber = e.target.value;
      handleChange(e)
    }, []);

    return (
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
                    defaultValue={values.lastName}
                    onBlur={handleChange}
                    // value={values.lastName}
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
                    onBlur={handleChange}
                    defaultValue={values.firstName}
                    // value={values.firstName}
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="parentName">Отчество</FormLabel>
                  <Input
                    id="parentName"
                    name="parentName"
                    placeholder="Отчество"
                    onBlur={handleChange}
                    defaultValue={values.parentName}
                    // value={values.parentName}
                  />
                  <FormErrorMessage>{errors.parentName}</FormErrorMessage>
                </FormControl>
                <PhoneInput
                  errors={errors}
                  touched={touched}
                  handleChange={handlePhoneChange}
                  defaultValue={values.phoneNumber}
                />
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
    );
  }
);


const PhoneInput = ({
  errors,
  touched,
  handleChange,
  defaultValue
}: any) => {
  const [phoneValue, setPhoneValue] = React.useState(defaultValue);
  return (
    <FormControl isInvalid={!!errors.phoneNumber && touched.phoneNumber}>
      <FormLabel htmlFor="phoneNumber">Номер телефона</FormLabel>
      <Input
        id="phoneNumber"
        name="phoneNumber"
        placeholder="+7 (999) 999-99-99"
        value={phoneValue}
        onBlur={handleChange}
        onChange={(e: any) => {
          setPhoneValue(normalizeInput(e.target.value!, phoneValue));
        }}
      />
      <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
    </FormControl>
  );
};

