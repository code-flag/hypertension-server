import asyncWrapper from "./asyncWrapper";
import jwt from "jsonwebtoken";

import {
  ApplicationError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../helper/error";
import CryptoJS from "crypto-js";
import dotEnv from "dotenv";

dotEnv.config();

export const verifyToken = asyncWrapper(
  async (request: any, response: any, next: any) => {
    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedError("No token provided.");
    }

    let token;

    if (authorization.startsWith("Bearer ")) {
      [, token] = authorization.split(" ");
    } else {
      token = authorization;
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET ?? "",
      async (error: any, decoded: any) => {
        if (error) {
          return next(
            new UnauthorizedError("Invalid token. Authorization failed!")
          );
        }

        // value 2 is for organization
        if (decoded.type === "customer") {
          // const customer: any = await Customer.findById(
          //   decoded?.id,
          //   "+password"
          // );
          // if (!customer) {
          //   return next(new UnauthorizedError("Invalid customer token."));
          // }
          // request.customer = customer;
          // request.token = {
          //   type: decoded.type,
          //   role: customer?.role ?? "customer",
          //   accessLevel: "customer",
          // };
        }
       
        return next();
      }
    );
  }
);

export const accessLevelPermit =
  (...permitted: any) =>
  (request: any, response: any, next: any) => {
    if (
      request.token &&
      request.token.accessLevel &&
      permitted.indexOf(request.token.accessLevel) !== -1
    ) {
      return next();
    }
    // this occur when the user accessLevel is not allowed
    // throw new ApplicationError(403, "Access denied. (ALP)");
  };

export const typePermit =
  (...permitted: any) =>
  (request: any, response: any, next: any) => {
    if (
      request.token &&
      request.token.type &&
      permitted.indexOf(request.token.type) !== -1
    ) {
      return next();
    }

    // this occur when the user is not actve or isActive field is false
    throw new ApplicationError(403, "Access denied. (TP)");
  };

export const rolePermit =
  (...permitted: any) =>
  (request: any, response: any, next: any) => {
    if (
      request.token &&
      request.token.role &&
      permitted.indexOf(request.token.role) !== -1
    ) {
      return next();
    }
    // this occur when the user doesn't have the permitted role
    // throw new ApplicationError(403, "Access denied. (RP)");
  };
