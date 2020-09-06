import * as yup from 'yup'

export const NewBookSchema = yup.object({
  href: yup.string(),
  linkKey: yup.string()
});