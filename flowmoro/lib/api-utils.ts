// src/lib/api-utils.ts
import { NextRequest, NextResponse } from "next/server";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_DATE"
  | "TASK_NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | (string & {}); 

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

// 공통 성공 응답
export function ok<T>(data: T, status: number = 200) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(body, { status });
}

// 공통 실패 응답
export function fail(
  code: ApiErrorCode,
  message: string,
  status: number = 400,
) {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message },
  };
  return NextResponse.json(body, { status });
}

// 모든 Route Handler에 공통으로 씌우는 에러 래퍼
export type AppRouteHandler = (
  req: NextRequest,
  context?: any,
) => Promise<Response>;

export function withErrorHandling(handler: AppRouteHandler) {
  return async (req: NextRequest, context?: any): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error(error);
      return fail(
        "INTERNAL_SERVER_ERROR",
        "서버 오류가 발생했습니다.",
        500,
      );
    }
  };
}
