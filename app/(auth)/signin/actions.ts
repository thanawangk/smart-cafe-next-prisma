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

// "use server";

// import { signIn } from "@/auth";
// import { signInSchema } from "@/schemas/auth";
// import { AuthError } from "next-auth";

// export type LoginState = {
//   ok: boolean;
//   formError?: string;
//   fieldErrors?: Record<string, string[]>;
//   email?: string;
// };

// export async function loginAction(
//   _prev: LoginState,
//   formData: FormData
// ): Promise<LoginState> {
//   const raw = {
//     email: String(formData.get("email") ?? ""),
//     password: String(formData.get("password") ?? ""),
//   };

//   // Zod validate first
//   const parsed = signInSchema.safeParse(raw);
//   if (!parsed.success) {
//     const flat = parsed.error.flatten();
//     return {
//       ok: false,
//       // formError: "Please fix the errors.",
//       fieldErrors: flat.fieldErrors,
//       email: raw.email,
//     };
//   }

//   try {
//     // Success will redirect to /dashboard
//     await signIn("credentials", { redirectTo: "/", ...parsed.data });
//     return { ok: true };
//   } catch (err) {
//     if (err instanceof AuthError) {
//       // Keep the inputs on screen
//       return {
//         ok: false,
//         formError:
//           err.type === "CredentialsSignin" || err.type === "CallbackRouteError"
//             ? "Invalid email or password."
//             : "Sign-in failed. Please try again.",
//       };
//     }
//     throw err;
//   }
// }
