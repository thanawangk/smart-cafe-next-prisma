import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // const { email, password } = await signInSchema.parseAsync(credentials);
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.password !== password) {
          // User not found
          throw new Error("Invalid credentials");
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = String(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      const userId = token.userId ?? token.sub ?? "";
      session.user = {
        ...(session.user ?? {}),
        id: String(userId),
      };
      return session;
    },
  },
  pages: { signIn: "/signin" },
  secret: process.env.AUTH_SECRET,
});
