"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";
import Image from "next/image";
import { useState } from "react";

const initialState: LoginState = { ok: false };

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );
  const [show, setShow] = useState(false);

  return (
    <div className="w-full max-w-6xl rounded-[28px] bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden md:block bg-[#FBFBFD] p-8">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cocoa/20">
              <span className="text-cocoa font-bold">▦</span>
            </div>
            <div className="font-semibold text-cocoa-dark text-lg">
              Smart <b>Café</b>
            </div>
          </div>

          <div className="mt-10 relative h-[360px] w-full">
            <Image
              src="/signin-cover.png"
              alt="Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-bold">Welcome</h1>

          {state.formError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.formError}
            </div>
          )}

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your Email"
                // defaultValue={state.email ?? ""}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-gray-400 outline-none"
              />
              {!!state.fieldErrors?.email?.length && (
                <p className="pl-3 mt-2 text-xs text-red-600">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:border-gray-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-2 text-xs text-gray-600 hover:bg-gray-50"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {!!state.fieldErrors?.password?.length && (
                <p className="pl-3 mt-2 text-xs text-red-600">
                  {state.fieldErrors.password.join(", ")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="w-full rounded-xl bg-cocoa text-white px-4 py-2 font-medium hover:bg-cocoa-dark transition"
              disabled={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <a href="#" className="hover:underline">
                Forgot password?
              </a>
              <span>© {new Date().getFullYear()} Smart Café</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
