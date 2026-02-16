import * as React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'

// --- Form Field Context ---
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

export const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined)

// --- Form Item Context ---
type FormItemContextValue = {
  id: string
}

export const FormItemContext = React.createContext<FormItemContextValue | undefined>(undefined)
