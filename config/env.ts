import * as dotenv from "dotenv";
import { convertToPascalCase, convertToUpperCaseAll } from "../util";

dotenv.config();

export const ACCOUNT_ID =
  process.env.ACCOUNT_ID ??
  (() => {
    throw new Error("환경 변수 ACCOUNT_ID 이(가) 설정되지 않았습니다.");
  })();
export const REGION =
  process.env.REGION ??
  (() => {
    throw new Error("환경 변수 REGION 이(가) 설정되지 않았습니다.");
  })();

export const GRAPHQL_LAMBDA_NAME =
  process.env.GRAPHQL_LAMBDA_NAME ??
  (() => {
    throw new Error(
      "환경 변수 GRAPHQL_LAMBDA_NAME 이(가) 설정되지 않았습니다."
    );
  })();
export const GRAPHQL_LAMBDA_VERSION =
  process.env.GRAPHQL_LAMBDA_VERSION ??
  (() => {
    throw new Error(
      "환경 변수 GRAPHQL_LAMBDA_VERSION 이(가) 설정되지 않았습니다."
    );
  })();

export const NODE_ENV = process.env.NODE_ENV ?? "dev";
export const NODE_ENV_PASCAL = convertToPascalCase(NODE_ENV);
export const NODE_ENV_UPPER = convertToUpperCaseAll(NODE_ENV);

export const DINNER_TIME_START =
  process.env.DINNER_TIME_START ??
  (() => {
    throw new Error("환경 변수 DINNER_TIME_START 이(가) 설정되지 않았습니다.");
  })();
export const DINNER_TIME_END =
  process.env.DINNER_TIME_END ??
  (() => {
    throw new Error("환경 변수 DINNER_TIME_END 이(가) 설정되지 않았습니다.");
  })();

export const TEST_TIME_START = "2025-03-04T16:20:00.000Z";
export const TEST_TIME_END = "2025-03-04T18:00:00.000Z";
