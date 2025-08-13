import { NextResponse } from "next/server";
import z from "zod";

export function respond<T extends z.ZodTypeAny>(
  schema: T,
  value: z.input<T>,
  init?: ResponseInit
) {
  const check = schema.safeParse(value);
  if (!check.success && process.env.NODE_ENV !== "production") {
    console.error("Response schema failed:", check.error);
    return NextResponse.json(
      { error: "Internal response invalid" },
      { status: 500 }
    );
  }
  return NextResponse.json(value, init);
}
