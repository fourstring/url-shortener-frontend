import {setLocale} from "yup";

setLocale({
  mixed: {
    default: "该条目的值不合法",
    required: "该条为必填项"
  },
  string: {
    min: ({min}) => `至少应包含${min}个字符`,
    max: ({max}) => `最多包含${max}个字符`,
    email: params => '不是合法的邮箱地址'
  }
});