import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";
import User from "@/models/User";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
          //   throw new Error("Missing email or password");
        }
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
            // throw new Error("No User found with this");
          }

          if (!user.password) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValidPassword) {
            return null;
            // throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            provider: user.provider,
          };
        } catch (error) {
          console.error("Auth error", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await connectToDatabase();

        let dbUser = await User.findOne({
          email: user.email,
        });

        if (!dbUser) {
          dbUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            providers: [account.provider],
          });
        } else {
          if (!dbUser.providers) {
            dbUser.providers = [];
          }
    
          if (!dbUser.providers.includes(account.provider)) {
            dbUser.providers.push(account.provider);
            await dbUser.save();
          }
        }
        user.id = dbUser._id.toString();
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
