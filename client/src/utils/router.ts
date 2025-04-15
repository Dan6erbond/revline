export const getQueryParam = (param: undefined | string | string[]) =>
  Array.isArray(param) ? param[0] : param;
