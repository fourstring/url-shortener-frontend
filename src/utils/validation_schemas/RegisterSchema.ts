import * as yup from "yup";

export const RegisterSchema = yup.object({
  email: yup.string().email().required(),
  username: yup.string().trim().min(4).max(16).required(),
  password: yup.string().trim().min(8).max(64).required(),
  repeatPassword: yup.string().trim().oneOf(
    [yup.ref('password'), undefined], '必须与密码一致').required()
})