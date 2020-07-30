import * as yup from 'yup'
export const LoginSchema = yup.object({
  username: yup.string()
    .trim()
    .min(4)
    .max(16)
    .required(),
  password: yup.string()
    .trim()
    .min(8)
    .max(64)
    .required()
});