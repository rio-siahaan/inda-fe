import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !credentials?.password) {
          throw new Error("Email atau password salah");
        }

        // dikomen untuk demo saja
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Password salah");
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name,
          email: profile.email,
          image: profile.picture,
          personifikasi: null
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name || "";
          if ("role" in user) {
            token.role = user.role;
          }
          if ("image" in user) {
            token.image = user.image;
          }
          if ("personifikasi" in user) {
            token.personifikasi = user.personifikasi;
          }
        }
      }
      if (account?.provider === "google") {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.image = user.image;
          token.personifikasi = user.personifikasi;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if ("email" in token) {
        session.user.email = token.email;
      }
      if ("id" in token) {
        session.user.id = token.id;
      }
      if ("name" in token) {
        session.user.name = token.name;
      }
      if ("role" in token) {
        session.user.role = token.role || "user";
      }
      if ("image" in token) {
        session.user.image = (token.image as string) || "/avatar-2.jpg";
      }
      if ("personifikasi" in token) {
        session.user.personifikasi = token.personifikasi;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const handler = NextAuth(authOptions);
