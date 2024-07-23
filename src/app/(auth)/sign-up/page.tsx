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

import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schema/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { EyeIcon, EyeOff } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [checkUsername, setCheckUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceUsername = useDebounceCallback(setUsername, 300);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  //TODO: debounce the confirm password
  // const debounceConfirmPassword = useDebounceValue(confirmPassword, 300);

  const { toast } = useToast();
  const router = useRouter();

  type SignUpForm = z.infer<typeof signUpSchema>;

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      // confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!username) {
        setUsernameMessage("");
        return;
      }
      setUsernameMessage("");
      setCheckUsername(true);
      try {
        const response = await axios.get(
          `/api/check-unique-username?username=${username}`
        );
        // console.log(response.data);
        setUsernameMessage(response.data.message);
        // if (response.data.isAvailable) {
        //   setUsernameMessage("Username is available");
        // } else {
        //   setUsernameMessage("Username is not available");
        // }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
          setUsernameMessage(
            axiosError?.response?.data.message ?? "An error occurred"
          );
        } else {
          setUsernameMessage("An error occurred");
        }
      } finally {
        setCheckUsername(false);
      }
    };
    checkUsernameAvailability();
  }, [username]);

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
        // status: "success",
      });
      setTimeout(() => {
        window.open("https://gmail.com", "_blank");
      }, 3000);
      router.push(`/verify/${username}`);
      // DONE: open gmail in the new tab after 3 second
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response) {
        toast({
          title: "Error",
          description: axiosError.response.data.message,
          // status: "error",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred",
          // status: "error",
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounceUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {checkUsername && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is available"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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

            <Button className="mt-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className=" text-center mt-8">
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
