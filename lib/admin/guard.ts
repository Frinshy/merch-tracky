import "server-only";

import { NextResponse } from "next/server";

import type { ApiResult } from "./types";

/** Admin tools only exist while running `next dev`. */
export const isAdminEnabled = () => process.env.NODE_ENV === "development";

/** An error that maps to an HTTP status code. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const fail = (status: number, message: string): never => {
  throw new HttpError(status, message);
};

/**
 * Wraps a route handler so it:
 * - returns 404 outside development, so production never exposes write access
 * - turns thrown errors into `{ error }` JSON responses
 * - wraps the return value as `{ data }`
 */
export function adminRoute<Args extends unknown[], T>(handler: (...args: Args) => Promise<T>) {
  return async (...args: Args): Promise<NextResponse<ApiResult<T>>> => {
    if (!isAdminEnabled()) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    try {
      return NextResponse.json({ data: await handler(...args) });
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      // eslint-disable-next-line no-console
      console.error(error);

      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Something went wrong." },
        { status: 500 },
      );
    }
  };
}
