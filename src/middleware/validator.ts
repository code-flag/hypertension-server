import { matchedData, validationResult } from "express-validator";
import { ApplicationError } from "../helper/error";

export default (schemas: any, status: number = 400) => {
  const validationCheck: any = async (request: any, _: any, next: any) => {
    const errors: any = validationResult(request);
    request = { ...request, ...matchedData(request) };

    if (!errors.isEmpty()) {
      const mappedErrors: any = Object.entries(errors.mapped()).reduce(
        (accumulator: any, [key, value]: any) => {
          accumulator[key] = value.msg;
          return accumulator;
        },
        {}
      );

      const validationErrors = new ApplicationError(
        status,
        "Invalid Credentials",
        mappedErrors
      );

      return next(validationErrors);
    }

    return next();
  };

  return [...(schemas.length && [schemas]), validationCheck];
};
