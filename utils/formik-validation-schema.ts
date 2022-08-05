import { z } from "zod";

export function createValidationError(e: z.ZodError) {
  const errors = {};
  e.errors.forEach((err) => {
    // @ts-ignore
    errors[err.path[0]] = err.message;
  })
  return errors;
}

export function toFormikValidationSchema<T>(
  values: object,
  schema: z.ZodSchema<T>,
  params?: Partial<z.ParseParams>
) {
  const errors = {};
  // console.debug(values)
  try {
    schema.parse(values, params);
  } catch (err: any) {
    return createValidationError(err);
  }
  return errors;
}
