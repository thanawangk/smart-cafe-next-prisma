import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  async function doLogout() {
    "use server";
    await signOut({ redirectTo: "/signin" });
  }

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <Link href="/" className="pl-2 flex items-center gap-2 font-semibold">
        <span>Smart Café</span>
      </Link>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="mr-3">Hi, {session?.user?.name ?? "Barista"}</span>

        <form action={doLogout}>
          <button
            type="submit"
            className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
