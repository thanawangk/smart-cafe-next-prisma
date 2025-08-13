"use server";

import { signIn } from "@/auth";
import { signInSchema } from "@/schemas/auth";
import { AuthError } from "next-auth";
import { ZodError } from "zod";

export type LoginState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(_prev: LoginState, formData: FormData) {
  try {
    const { email, password } = await signInSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", { redirectTo: "/", email, password });
    return { ok: true };
  } catch (err) {
    // Zod validation errors (bad/missing fields)
    if (err instanceof ZodError) {
      const flat = err.flatten();
      return {
        ok: false,
        fieldErrors: flat.fieldErrors,
      };
    }
    // Auth.js errors (bad credentials, etc.)
    if (err instanceof AuthError) {
      if (
        err.type === "CredentialsSignin" ||
        err.type === "CallbackRouteError"
      ) {
        return { ok: false, formError: "Invalid email or password" };
      }
      return { ok: false, formError: "Sign-in failed. Please try again." };
    }
    throw err; // unexpected error
  }
}
