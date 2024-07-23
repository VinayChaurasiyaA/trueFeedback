import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { Awaitable, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
import bcrypt from "bcrypt";

// Define a type for credentials

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@gmail.com",
        },
        // username: {
        //   label: "Username",
        //   type: "text",
        //   placeholder: "jsmith",
        // },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<any> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email first");
          }
          // console.log(user.password);
          // console.log(credentials.password);
          //FIX: Check if this is the correct way to compare passwords
          const isCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // const isCorrect = user.password === credentials.password;
          // console.log(isCorrect);
          if (!isCorrect) {
            throw new Error("Invalid password");
          }
          return user;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message); // Ensures that error is an instance of Error before accessing message
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user?.isVerified;
        token.isAcceptingMessage = user?.isAcceptingMessage;
        token.username = user?.username;
      }
      return token;
    },
  },
};
