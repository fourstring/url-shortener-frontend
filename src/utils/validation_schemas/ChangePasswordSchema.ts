import * as yup from "yup";
export const ChangePasswordSchema = yup.object({
  original: yup.string().trim().min(8).max(64).required(),
  new: yup.string().trim().min(8).max(64).required(),
  repeatNew: yup.string().trim().oneOf(
    [yup.ref('new'), undefined], '必须与密码一致').required()
})
