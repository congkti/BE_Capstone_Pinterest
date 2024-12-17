export const responseSuccess = (
  metaData = null,
  message = "Call Api OK",
  code = 200
) => {
  return {
    status: "success",
    code,
    message,
    metaData,
    doc: "http://localhost:3070/api-docs",
  };
};

export const responseError = (
  message = "Internal Server Error",
  code = 500,
  stack = null
) => {
  return {
    status: `error`,
    code: code,
    message: message,
    stack: stack, //log ra những dòng báo lỗi trên terminal
  };
};
