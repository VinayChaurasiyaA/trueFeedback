import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { Awaitable, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

// Define a type for credentials

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
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

    async jwt({ token, user, account, profile }) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.isAcceptingMessage = user.isAcceptingMessage;
        // console.log("User object:", user); // Debugging
        token._id = user._id;
        token.username = user.username;
      } else if (account?.provider === "google" && profile?.email) {
        await dbConnect();
        let dbUser = await UserModel.findOne({ email: profile.email });
        if (!dbUser) {
          dbUser = new UserModel({
            username: profile?.name?.trim().split(" ")[1] ?? "",
            email: profile.email,
            password: await bcrypt.hash("12345678", 10),
            isVerified: true,
            isAcceptingMessage: true,
            messages: [],
            verifyCodeExpiry: new Date(),
            verifyCode: "123456",
          });
          // console.log(dbUser);
          await dbUser.save();
        }

        token._id = (dbUser?._id as string)?.toString();
        token.isVerified = dbUser.isVerified;
        token.username = dbUser.username;
        token.isAcceptingMessage = dbUser.isAcceptingMessage;
      }
      // console.log(token);
      return token;
    },
    // use this below signIn only if i am making from the google

    async signIn({ account, profile }): Promise<string | boolean> {
      // Your code here
      // console.log("google clicked lol");
      // console.log("Account : ", account?.providerAccountId);

      await dbConnect();
      let dbUser = await UserModel.findOne({
        $or: [{ email: profile?.email }, { _id: account?.providerAccountId }],
      });
      if (!dbUser) {
        // how to just take the first name of the user
        dbUser = new UserModel({
          username: profile?.name?.trim().split(" ")[0],
          email: profile?.email,
          password: "12345678",
          isVerified: true,
          isAcceptingMessage: true,
          messages: [],
          verifyCodeExpiry: new Date(),
          verifyCode: "123456",
        });
        await dbUser.save();
      }
      return true;
    },
    // Your code here
  },
};
