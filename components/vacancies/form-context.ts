import React from "react";
import {z} from "zod";


export const applyForSchema = z.object({
  lastName: z.string().min(1, "Поле не должно быть пустым"),
  firstName: z.string().min(1, "Поле не должно быть пустым"),
  parentName: z.string().optional(),
  phoneNumber: z.string().length(18, "Номер должен быть в формате: +7 (999) 999-99-99").min(1, "Поле не должно быть пустым"),
})

type FormContextProps = z.infer<typeof applyForSchema> & {};
export const FormContext = React.createContext<FormContextProps>({
  lastName: "",
  firstName: "",
  parentName: "",
  phoneNumber: "",
});
