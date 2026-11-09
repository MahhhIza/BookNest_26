export type CrudFormProps<TInput> = {
  initial?: TInput
  saving: boolean
  fieldErrors?: Partial<Record<keyof TInput, string>>
  submitLabel: string
  onSubmit: (values: TInput) => void
}
