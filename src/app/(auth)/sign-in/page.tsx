"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { signInSchema } from "@/schema/signInSchema";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { EyeIcon } from "lucide-react";
import GoogleSignInButton from "next-auth/providers/google";
// import { router } from "next/router";

const page = () => {
  type SignInForm = z.infer<typeof signInSchema>;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const router = useRouter();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const onSubmit = async (data: SignInForm) => {
    // const response = await axios.post("/api/sign-in", data);
    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      // console.log(response);

      if (response?.error) {
        toast({
          title: "An error occurred",
          description: response?.error,
          variant: "destructive",
        });
      }

      if (response?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast({
          title: "An error occurred",
          description: axiosError.response.data.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center text-secondary-foreground items-center min-h-screen bg-gray-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            TrueFeed Back
          </h1>
          <p className="text-secondary-foreground">
            Create an account to start using TrueFeed Back
          </p>
        </div>

        <Form {...form}>
          <form className="sppace-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeIcon size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-2" type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <Button className="text center" onClick={() => signIn("google")}>
          Sign in with Google
        </Button>
        <div className=" text-center mt-8">
          <p className="text-center text-gray-500">
            Don't have an account ?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
